// node:test registra los casos con promesas que el runner ya espera
/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'
import {
  buildSesionRow,
  createSaveSessionJob,
  runSaveSessionJob,
  type SesionAGuardar,
  type SesionRow,
  type SessionRepository,
} from '../saveSessionFlow.ts'

const TZ_ARGENTINA = 'America/Argentina/Buenos_Aires'

function sesion(fecha: Date, tecnicaEstudio: number): SesionAGuardar {
  return {
    uuid: 'user-1',
    horaInicioSesion: '21:30:00',
    fecha,
    horaFinSesion: '22:30:00',
    tecnicaEstudio,
    tipoMotivacion: 1,
    cantidadObjetivosCumplidos: 0,
    cantidadObjetivos: 0,
    tiempoEstudio: 3600,
    musicaSeleccionada: 0,
    eventoSeleccionado: null,
  }
}

// Ejecuta el writer completo con un repositorio mock y devuelve el body del insert
async function payloadInsertado(sessionToSave: SesionAGuardar) {
  const inserts: SesionRow[] = []
  const repo: SessionRepository = {
    insertSesion: row => {
      // Mismo paso que hace supabase-js antes de enviar el body
      inserts.push(JSON.parse(JSON.stringify(row)) as SesionRow)
      return Promise.resolve()
    },
    getAgregadosUsuario: () =>
      Promise.resolve({
        objetivosCumplidos: 0,
        sesionesDeEstudio: 0,
        sesionesPositivas: 0,
        sesionesNegativas: 0,
      }),
    updateAgregadosUsuario: () => Promise.resolve(),
    updateHorasEvento: () => Promise.resolve(),
    getProgresoInsignias: () => Promise.resolve([]),
    upsertProgresoInsignia: () => Promise.resolve(),
  }
  const job = createSaveSessionJob({
    sesion: buildSesionRow(sessionToSave),
    motivationType: 'Positiva',
    insigniaIds: [],
    events: [],
    evento: null,
  })
  await runSaveSessionJob(job, repo)
  assert.equal(inserts.length, 1)
  return inserts[0]
}

describe('fecha de la sesión con zona horaria de Argentina', () => {
  const tzOriginal = process.env.TZ

  before(() => {
    process.env.TZ = TZ_ARGENTINA
  })

  after(() => {
    if (tzOriginal === undefined) delete process.env.TZ
    else process.env.TZ = tzOriginal
  })

  it('usa la zona horaria controlada', () => {
    // Argentina es UTC-3 todo el año
    assert.equal(new Date(2026, 9, 14, 21, 30).getTimezoneOffset(), 180)
  })

  // CapyDoro (tecnicaEstudio 1) y CapyMetro (2) usan el mismo writer
  for (const tecnica of [1, 2]) {
    it(`después de las 21 h conserva el día local (técnica ${tecnica})`, async () => {
      const inicio = new Date(2026, 9, 14, 21, 30)
      assert.equal(inicio.toISOString().slice(0, 10), '2026-10-15')

      const row = await payloadInsertado(sesion(inicio, tecnica))
      assert.equal(row.fecha, '2026-10-14')
    })

    it(`después de las 21 h a fin de mes conserva mes y día locales (técnica ${tecnica})`, async () => {
      const inicio = new Date(2026, 9, 31, 22, 15)
      assert.equal(inicio.toISOString().slice(0, 10), '2026-11-01')

      const row = await payloadInsertado(sesion(inicio, tecnica))
      assert.equal(row.fecha, '2026-10-31')
    })

    it(`antes de las 21 h coincide con el día UTC (técnica ${tecnica})`, async () => {
      const inicio = new Date(2026, 9, 14, 20, 59)
      assert.equal(inicio.toISOString().slice(0, 10), '2026-10-14')

      const row = await payloadInsertado(sesion(inicio, tecnica))
      assert.equal(row.fecha, '2026-10-14')
    })
  }
})
