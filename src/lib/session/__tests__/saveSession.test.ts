// node:test registra los casos con promesas que el runner ya espera
/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  calcularProgresoInactividad,
  calcularProgresoInsignia,
  type DatosInsignias,
} from '../insignias.ts'
import {
  createSaveSessionJob,
  runSaveSessionJob,
  SaveSessionError,
  type AgregadosUsuario,
  type ProgresoInsignia,
  type SesionRow,
  type SessionRepository,
} from '../saveSessionFlow.ts'

const AHORA = new Date(2026, 9, 14, 18, 0, 0)
const INSIGNIAS = Array.from({ length: 15 }, (_, index) => index + 1)

function sesion(overrides: Partial<SesionRow> = {}): SesionRow {
  return {
    idUsuario: 'user-1',
    horaInicioSesion: '16:00:00',
    fecha: '2026-10-14',
    horaFinSesion: '18:00:00',
    tecnicaEstudio: 1,
    tipoMotivacion: 1,
    cantidadObjetivosCumplidos: 2,
    cantidadObjetivos: 2,
    tiempoEstudio: 25 * 60,
    musicaSeleccionada: 0,
    eventoSeleccionado: null,
    ...overrides,
  }
}

type Call = [string, ...unknown[]]

// Repositorio en memoria: registra llamadas y permite inyectar fallos o demoras
function fakeRepo({
  agregados = {
    objetivosCumplidos: 0,
    sesionesDeEstudio: 0,
    sesionesPositivas: 0,
    sesionesNegativas: 0,
  },
  progreso = [],
}: {
  agregados?: AgregadosUsuario | null
  progreso?: ProgresoInsignia[]
} = {}) {
  const calls: Call[] = []
  const failures = new Map<string, number>()
  const gates: (() => void)[] = []
  let gated = false
  const upserts = new Map<number, number>()

  async function call(name: string, ...args: unknown[]) {
    calls.push([name, ...args])
    if (gated) await new Promise<void>(resolve => gates.push(resolve))
    const remaining = failures.get(name) ?? 0
    if (remaining > 0) {
      failures.set(name, remaining - 1)
      throw new Error(`${name} falló`)
    }
  }

  const repo: SessionRepository = {
    insertSesion: row => call('insertSesion', row),
    getAgregadosUsuario: async userId => {
      await call('getAgregadosUsuario', userId)
      return agregados
    },
    updateAgregadosUsuario: (userId, value) =>
      call('updateAgregadosUsuario', userId, value),
    updateHorasEvento: (userId, evento, horas) =>
      call('updateHorasEvento', userId, evento.title, horas),
    getProgresoInsignias: async userId => {
      await call('getProgresoInsignias', userId)
      return progreso
    },
    upsertProgresoInsignia: async (userId, value) => {
      await call(`upsert:${value.idInsignia}`, userId, value.progreso)
      upserts.set(value.idInsignia, value.progreso)
    },
  }

  return {
    repo,
    calls,
    upserts,
    count: (name: string) => calls.filter(([n]) => n === name).length,
    fail(name: string, times = 1) {
      failures.set(name, times)
    },
    hold() {
      gated = true
    },
    release() {
      gated = false
      gates.splice(0).forEach(resolve => resolve())
    },
  }
}

function job(overrides: Partial<SesionRow> = {}, motivationType = 'Positiva') {
  return createSaveSessionJob({
    sesion: sesion(overrides),
    motivationType,
    insigniaIds: INSIGNIAS,
    events: [],
    evento: null,
  })
}

describe('guardado de sesión', () => {
  it('espera cada escritura en orden y resuelve al terminar', async () => {
    const fake = fakeRepo()
    const result = await runSaveSessionJob(job(), fake.repo, () => AHORA)

    assert.equal(result.status, 'saved')
    assert.deepEqual(
      fake.calls.slice(0, 4).map(([name]) => name),
      [
        'insertSesion',
        'getAgregadosUsuario',
        'updateAgregadosUsuario',
        'getProgresoInsignias',
      ]
    )
    assert.deepEqual(fake.calls[2][2], {
      objetivosCumplidos: 2,
      sesionesDeEstudio: 1,
      sesionesPositivas: 1,
      sesionesNegativas: 0,
    })
    // La 15 se calcula aparte, con el historial completo
    assert.equal(fake.upserts.has(15), false)
    assert.equal(fake.upserts.size, 14)
  })

  it('un guardado lento comparte la promesa ante un doble clic', async () => {
    const fake = fakeRepo()
    fake.hold()
    const saving = job()
    const first = runSaveSessionJob(saving, fake.repo, () => AHORA)
    const second = runSaveSessionJob(saving, fake.repo, () => AHORA)
    assert.equal(first, second)

    let settled = false
    void first.then(() => (settled = true))
    await new Promise(resolve => setTimeout(resolve, 5))
    assert.equal(settled, false)

    fake.release()
    // Cada paso queda retenido hasta liberar el siguiente
    const releaser = setInterval(() => fake.release(), 1)
    await first
    clearInterval(releaser)
    assert.equal(fake.count('insertSesion'), 1)
    assert.equal(fake.count('updateAgregadosUsuario'), 1)
  })

  it('propaga el error y reintenta desde el paso fallido sin duplicar', async () => {
    const fake = fakeRepo({
      agregados: {
        objetivosCumplidos: 10,
        sesionesDeEstudio: 4,
        sesionesPositivas: 4,
        sesionesNegativas: 0,
      },
    })
    fake.fail('updateAgregadosUsuario')
    const saving = job()

    await assert.rejects(
      runSaveSessionJob(saving, fake.repo, () => AHORA),
      (error: unknown) =>
        error instanceof SaveSessionError &&
        error.step === 'agregados' &&
        error.partial
    )
    assert.equal(saving.status, 'pending')

    await runSaveSessionJob(saving, fake.repo, () => AHORA)
    assert.equal(saving.status, 'saved')
    assert.equal(fake.count('insertSesion'), 1)
    assert.equal(fake.count('getAgregadosUsuario'), 1)

    const updates = fake.calls.filter(([n]) => n === 'updateAgregadosUsuario')
    assert.equal(updates.length, 2)
    // El reintento escribe el mismo valor absoluto, no vuelve a sumar
    assert.deepEqual(updates[0][2], updates[1][2])
    assert.equal((updates[1][2] as AgregadosUsuario).sesionesDeEstudio, 5)
  })

  it('un fallo en el insert no escribe agregados', async () => {
    const fake = fakeRepo()
    fake.fail('insertSesion')
    const saving = job()
    await assert.rejects(
      runSaveSessionJob(saving, fake.repo, () => AHORA),
      (error: unknown) =>
        error instanceof SaveSessionError &&
        error.step === 'sesion' &&
        !error.partial
    )
    assert.equal(fake.count('updateAgregadosUsuario'), 0)
  })

  it('reintenta solo las insignias que fallaron', async () => {
    const fake = fakeRepo()
    fake.fail('upsert:6')
    const saving = job()
    await assert.rejects(
      runSaveSessionJob(saving, fake.repo, () => AHORA),
      (error: unknown) =>
        error instanceof SaveSessionError && error.step === 'insignias'
    )
    assert.deepEqual(saving.insigniasPendientes, [
      { idInsignia: 6, progreso: 20 },
    ])

    await runSaveSessionJob(saving, fake.repo, () => AHORA)
    assert.equal(fake.count('upsert:6'), 2)
    assert.equal(fake.count('upsert:7'), 1)
  })

  it('primera sesión: usuario sin progreso previo con todos los objetivos cumplidos', async () => {
    const fake = fakeRepo()
    await runSaveSessionJob(job(), fake.repo, () => AHORA)
    assert.equal(fake.upserts.get(11), 100)
    assert.equal(fake.upserts.get(6), 20)
    assert.equal(fake.upserts.get(4), 0)
  })

  it('con historial: no baja el progreso ni reescribe insignias desbloqueadas', async () => {
    const fake = fakeRepo({
      agregados: {
        objetivosCumplidos: 40,
        sesionesDeEstudio: 20,
        sesionesPositivas: 20,
        sesionesNegativas: 0,
      },
      progreso: [
        { idInsignia: 11, progreso: 100 },
        { idInsignia: 4, progreso: 100 },
        { idInsignia: 3, progreso: 40 },
      ],
    })
    await runSaveSessionJob(
      job({ cantidadObjetivosCumplidos: 1, cantidadObjetivos: 3 }),
      fake.repo,
      () => AHORA
    )
    assert.equal(fake.upserts.has(11), false)
    assert.equal(fake.upserts.has(4), false)
    assert.equal(fake.upserts.get(3), 40)
    assert.equal(fake.upserts.get(12), 100)
    assert.equal(fake.upserts.get(7), 100)
  })

  it('suma las horas del evento una sola vez y las usa para la insignia 5', async () => {
    const fake = fakeRepo()
    fake.fail('updateHorasEvento')
    const fecha = new Date(2026, 11, 1)
    const saving = createSaveSessionJob({
      sesion: sesion({ tiempoEstudio: 3600, eventoSeleccionado: 7 }),
      motivationType: 'Positiva',
      insigniaIds: INSIGNIAS,
      events: [{ id: 7, date: fecha, hoursAcumulated: 9.5 * 3600 }],
      evento: { id: 7, title: 'Final', date: fecha, horasPrevias: 9.5 * 3600 },
    })
    await assert.rejects(runSaveSessionJob(saving, fake.repo, () => AHORA))
    await runSaveSessionJob(saving, fake.repo, () => AHORA)

    const updates = fake.calls.filter(([n]) => n === 'updateHorasEvento')
    assert.deepEqual(
      updates.map(([, , , horas]) => horas),
      [10.5 * 3600, 10.5 * 3600]
    )
    assert.equal(saving.horasEvento, 10.5 * 3600)
    assert.equal(fake.upserts.get(5), 100)
  })

  it('falla si el usuario no tiene fila de agregados', async () => {
    const fake = fakeRepo({ agregados: null })
    await assert.rejects(
      runSaveSessionJob(job(), fake.repo, () => AHORA),
      (error: unknown) =>
        error instanceof SaveSessionError && error.step === 'agregados'
    )
    assert.equal(fake.count('updateAgregadosUsuario'), 0)
  })
})

describe('criterios de insignias', () => {
  const base: DatosInsignias = {
    sesionesNegativas: 0,
    sesionesPositivas: 0,
    sesionesDeEstudio: 1,
    objetivosCumplidos: 0,
    tiempoEstudiado: 0,
    objetivosSesion: 0,
    objetivosCumplidosSesion: 0,
  }
  const calcular = (id: number, datos: Partial<DatosInsignias>) =>
    calcularProgresoInsignia(id, { ...base, ...datos }, [], AHORA)

  it('11 exige cumplir todos los objetivos de la sesión', () => {
    assert.equal(
      calcular(11, { objetivosSesion: 3, objetivosCumplidosSesion: 3 }),
      100
    )
    assert.equal(
      calcular(11, { objetivosSesion: 3, objetivosCumplidosSesion: 2 }),
      0
    )
    assert.equal(
      calcular(11, { objetivosSesion: 0, objetivosCumplidosSesion: 0 }),
      0
    )
    // El acumulado histórico no interviene
    assert.equal(
      calcular(11, {
        objetivosCumplidos: 50,
        objetivosSesion: 3,
        objetivosCumplidosSesion: 1,
      }),
      0
    )
  })

  it('4 usa el estudio efectivo de la sesión', () => {
    assert.equal(calcular(4, { tiempoEstudiado: 2 * 3600 }), 100)
    assert.equal(calcular(4, { tiempoEstudiado: 2 * 3600 - 1 }), 0)
  })

  it('15 sin sesiones no progresa ni falla', () => {
    assert.equal(calcularProgresoInactividad([], AHORA), 0)
  })

  it('15 compara contra la sesión más reciente', () => {
    const vieja = { fecha: '2026-08-01', horaInicioSesion: '10:00:00+00' }
    const reciente = { fecha: '2026-10-01', horaInicioSesion: '10:00:00-03' }
    assert.equal(calcularProgresoInactividad([vieja], AHORA), 100)
    assert.equal(calcularProgresoInactividad([vieja, reciente], AHORA), 0)
    assert.equal(
      calcularProgresoInactividad(
        [{ fecha: 'x', horaInicioSesion: 'y' }],
        AHORA
      ),
      0
    )
  })
})
