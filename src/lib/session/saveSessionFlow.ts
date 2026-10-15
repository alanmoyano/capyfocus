// Secuencia de guardado de una sesión de estudio.
//
// Cada paso se espera y un error corta la secuencia con SaveSessionError.
// El job recuerda qué pasos terminaron y los valores absolutos que calculó, así
// que reintentar el mismo job continúa desde el paso fallido sin volver a sumar
// agregados ni insertar la sesión otra vez. Esto evita duplicados dentro de la
// misma pestaña; no reemplaza una transacción del servidor (ver propuesta en la
// entrega): si una escritura se aplicó pero la respuesta se perdió, el reintento
// puede repetirla.

import { formatDateDash } from '../dates.ts'
import {
  calcularProgresoInsignia,
  ID_INSIGNIA_INACTIVIDAD,
  type DatosInsignias,
  type EventoInsignia,
} from './insignias.ts'

// Datos de la sesión tal como los arman Timer y Pomodoro
export type SesionAGuardar = {
  uuid: string
  horaInicioSesion: string
  fecha: Date
  horaFinSesion: string
  tecnicaEstudio: number
  tipoMotivacion: number
  cantidadObjetivosCumplidos: number
  cantidadObjetivos: number
  tiempoEstudio: number
  musicaSeleccionada: number
  eventoSeleccionado: number | null
}

// Fila que se inserta en SesionesDeEstudio
export type SesionRow = {
  idUsuario: string
  horaInicioSesion: string
  fecha: string // YYYY-MM-DD, día local de inicio de la sesión
  horaFinSesion: string
  tecnicaEstudio: number
  tipoMotivacion: number
  cantidadObjetivosCumplidos: number
  cantidadObjetivos: number
  tiempoEstudio: number
  musicaSeleccionada: number
  eventoSeleccionado: number | null
}

// `fecha` se envía como día local YYYY-MM-DD. Un Date se serializaría en UTC y
// una sesión empezada después de las 21 h en Argentina quedaría con el día siguiente.
// Esto normaliza las nuevas escrituras; no corrige fechas ya guardadas.
export function buildSesionRow(sessionToSave: SesionAGuardar): SesionRow {
  return {
    idUsuario: sessionToSave.uuid,
    horaInicioSesion: sessionToSave.horaInicioSesion,
    fecha: formatDateDash(sessionToSave.fecha),
    horaFinSesion: sessionToSave.horaFinSesion,
    tecnicaEstudio: sessionToSave.tecnicaEstudio,
    tipoMotivacion: sessionToSave.tipoMotivacion,
    cantidadObjetivosCumplidos: sessionToSave.cantidadObjetivosCumplidos,
    cantidadObjetivos: sessionToSave.cantidadObjetivos,
    tiempoEstudio: sessionToSave.tiempoEstudio,
    musicaSeleccionada: sessionToSave.musicaSeleccionada,
    eventoSeleccionado: sessionToSave.eventoSeleccionado,
  }
}

export type AgregadosUsuario = {
  objetivosCumplidos: number
  sesionesDeEstudio: number
  sesionesPositivas: number
  sesionesNegativas: number
}

export type ProgresoInsignia = { idInsignia: number; progreso: number }

export type EventoSeleccionado = {
  id: number
  title: string
  date: Date
  horasPrevias: number
}

export type SessionRepository = {
  insertSesion: (row: SesionRow) => Promise<void>
  getAgregadosUsuario: (userId: string) => Promise<AgregadosUsuario | null>
  updateAgregadosUsuario: (
    userId: string,
    agregados: AgregadosUsuario
  ) => Promise<void>
  updateHorasEvento: (
    userId: string,
    evento: { title: string; date: Date },
    horas: number
  ) => Promise<void>
  getProgresoInsignias: (userId: string) => Promise<ProgresoInsignia[]>
  upsertProgresoInsignia: (
    userId: string,
    progreso: ProgresoInsignia
  ) => Promise<void>
}

export type SaveSessionStep = 'sesion' | 'agregados' | 'evento' | 'insignias'

export class SaveSessionError extends Error {
  step: SaveSessionStep
  // Indica si alguna escritura previa ya quedó aplicada
  partial: boolean

  constructor(step: SaveSessionStep, partial: boolean, cause: unknown) {
    super(`No se pudo guardar la sesión (paso: ${step})`, { cause })
    this.name = 'SaveSessionError'
    this.step = step
    this.partial = partial
  }
}

export type SaveSessionJob = {
  userId: string
  sesion: SesionRow
  motivationType: string
  insigniaIds: number[]
  events: (EventoInsignia & { id: number })[]
  evento: EventoSeleccionado | null
  status: 'pending' | 'saved'
  // Progreso del guardado
  sesionGuardada: boolean
  agregados: AgregadosUsuario | null
  agregadosGuardados: boolean
  horasEvento: number | null
  eventoGuardado: boolean
  insigniasPendientes: ProgresoInsignia[] | null
}

export function createSaveSessionJob({
  sesion,
  motivationType,
  insigniaIds,
  events,
  evento,
}: {
  sesion: SesionRow
  motivationType: string
  insigniaIds: number[]
  events: (EventoInsignia & { id: number })[]
  evento: EventoSeleccionado | null
}): SaveSessionJob {
  return {
    userId: sesion.idUsuario,
    sesion,
    motivationType,
    insigniaIds,
    events,
    evento,
    status: 'pending',
    sesionGuardada: false,
    agregados: null,
    agregadosGuardados: false,
    horasEvento: null,
    eventoGuardado: false,
    insigniasPendientes: null,
  }
}

export function sumarSesionAAgregados(
  previos: AgregadosUsuario,
  sesion: SesionRow,
  motivationType: string
): AgregadosUsuario {
  return {
    objetivosCumplidos:
      previos.objetivosCumplidos + sesion.cantidadObjetivosCumplidos,
    sesionesDeEstudio: previos.sesionesDeEstudio + 1,
    sesionesPositivas:
      previos.sesionesPositivas + (motivationType === 'Positiva' ? 1 : 0),
    sesionesNegativas:
      previos.sesionesNegativas +
      (motivationType === 'Pasivo Agresiva' ? 1 : 0),
  }
}

// El progreso no baja: una insignia desbloqueada (100) no se vuelve a escribir.
export function calcularInsigniasAGuardar(
  job: SaveSessionJob,
  agregados: AgregadosUsuario,
  existentes: ProgresoInsignia[],
  ahora: Date
): ProgresoInsignia[] {
  const datos: DatosInsignias = {
    ...agregados,
    tiempoEstudiado: job.sesion.tiempoEstudio,
    objetivosSesion: job.sesion.cantidadObjetivos,
    objetivosCumplidosSesion: job.sesion.cantidadObjetivosCumplidos,
  }
  const events = job.events.map(event =>
    event.id === job.evento?.id && job.horasEvento !== null
      ? { ...event, hoursAcumulated: job.horasEvento }
      : event
  )

  return job.insigniaIds
    .filter(id => id !== ID_INSIGNIA_INACTIVIDAD)
    .flatMap(idInsignia => {
      const previo =
        existentes.find(row => row.idInsignia === idInsignia)?.progreso ?? 0
      if (previo >= 100) return []
      const nuevo = calcularProgresoInsignia(idInsignia, datos, events, ahora)
      return [{ idInsignia, progreso: Math.max(previo, nuevo) }]
    })
}

const inFlight = new WeakMap<SaveSessionJob, Promise<SaveSessionJob>>()

// Ejecuta (o continúa) el guardado. Llamadas concurrentes con el mismo job
// comparten la misma promesa, así un doble clic no duplica escrituras.
export function runSaveSessionJob(
  job: SaveSessionJob,
  repo: SessionRepository,
  now: () => Date = () => new Date()
): Promise<SaveSessionJob> {
  if (job.status === 'saved') return Promise.resolve(job)
  const running = inFlight.get(job)
  if (running) return running

  const promise = runSteps(job, repo, now).finally(() => inFlight.delete(job))
  inFlight.set(job, promise)
  return promise
}

async function step<T>(
  job: SaveSessionJob,
  name: SaveSessionStep,
  action: () => Promise<T>
) {
  try {
    return await action()
  } catch (error) {
    throw new SaveSessionError(name, job.sesionGuardada, error)
  }
}

async function runSteps(
  job: SaveSessionJob,
  repo: SessionRepository,
  now: () => Date
) {
  if (!job.sesionGuardada) {
    await step(job, 'sesion', () => repo.insertSesion(job.sesion))
    job.sesionGuardada = true
  }

  if (!job.agregados) {
    const previos = await step(job, 'agregados', async () => {
      const result = await repo.getAgregadosUsuario(job.userId)
      if (!result) throw new Error('No se encontraron los datos del usuario')
      return result
    })
    job.agregados = sumarSesionAAgregados(
      previos,
      job.sesion,
      job.motivationType
    )
  }
  const agregados = job.agregados

  if (!job.agregadosGuardados) {
    await step(job, 'agregados', () =>
      repo.updateAgregadosUsuario(job.userId, agregados)
    )
    job.agregadosGuardados = true
  }

  if (job.evento && !job.eventoGuardado) {
    const evento = job.evento
    job.horasEvento ??= evento.horasPrevias + job.sesion.tiempoEstudio
    const horas = job.horasEvento
    await step(job, 'evento', () =>
      repo.updateHorasEvento(job.userId, evento, horas)
    )
    job.eventoGuardado = true
  }

  if (!job.insigniasPendientes) {
    const existentes = await step(job, 'insignias', () =>
      repo.getProgresoInsignias(job.userId)
    )
    job.insigniasPendientes = calcularInsigniasAGuardar(
      job,
      agregados,
      existentes,
      now()
    )
  }

  const pendientes = job.insigniasPendientes
  const resultados = await Promise.allSettled(
    pendientes.map(progreso =>
      repo.upsertProgresoInsignia(job.userId, progreso)
    )
  )
  job.insigniasPendientes = pendientes.filter(
    (_, index) => resultados[index].status === 'rejected'
  )
  const fallo = resultados.find(
    (resultado): resultado is PromiseRejectedResult =>
      resultado.status === 'rejected'
  )
  if (fallo) throw new SaveSessionError('insignias', true, fallo.reason)

  job.status = 'saved'
  return job
}
