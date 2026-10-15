import {
  Insignia,
  InsigniaXUsuario,
} from '@/components/contexts/InsigniasContext'
import { supabase } from '@/components/supabase/client'
import type { Session } from '@supabase/supabase-js'
import type { Event } from '@/components/ComponentesEspecifico/Eventos'
import {
  calcularProgresoInactividad,
  calcularProgresoInsignia,
  ID_INSIGNIA_INACTIVIDAD,
  type DatosInsignias,
  type SesionParaInactividad,
} from '@/lib/session/insignias'
import { formatDateDash } from '@/lib/dates'
import {
  buildSesionRow,
  createSaveSessionJob,
  runSaveSessionJob,
  type AgregadosUsuario,
  type ProgresoInsignia,
  type SaveSessionJob,
  type SesionAGuardar,
  type SessionRepository,
} from '@/lib/session/saveSessionFlow'

export {
  SaveSessionError,
  type SaveSessionJob,
  type SesionAGuardar,
} from '@/lib/session/saveSessionFlow'

type EventToRecover = {
  idEvento: number
  nombre: string
  idUsuario: string
  fechaLimite: string
  horasAcumuladas: number | null
}

export type sessionInfo = {
  fecha: string
  objetivosTotales: number
  objetivosCumplidos: number
  tiempoEstudio: number
  cantidadSesiones: number
}
/* eslint-disable @typescript-eslint/no-unsafe-return */
function dateToTimetz(date: Date | null): string {
  // funcion que es necesaria para guardar horas dentro de la bd, ya que el tiempo que pide es Timetz
  // Obtiene la parte de la hora y la zona horaria
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Argentina/Buenos_Aires', // Cambia esto a la zona horaria que necesites
    hour: '2-digit', // Formato de hora de dos dígitos
    minute: '2-digit', // Formato de minutos de dos dígitos
    second: '2-digit', // Formato de segundos de dos dígitos
    hour12: false, // Formato de 24 horas
  }
  //@ts-expect-error anda, no te preocupes
  return date.toLocaleString('es-AR', options)
}

const formatDateSlash = (date: Date | string) => {
  // Función que nos permite pasar de un objeto tipo date a uno de tipo string en formato YYYY/MM/DD
  // Esta es LA FUNCIÓN A USAR si queremos guardar fechas en algún lado, porque asi es más fácil recuperarlas y transformarlas en objetos tipo DATE

  if (typeof date === 'object') {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}/${month}/${day}`
  } else {
    const fechaSplited = date.split('-')
    const year = fechaSplited[0]
    const month = fechaSplited[1]
    const day = fechaSplited[2]

    return `${year}/${month}/${day}`
  }
}

async function deleteEvent(date: Date, name: string, uuid: string) {
  const { data, error } = await supabase
    .from('Eventos')
    .delete()
    .eq('nombre', name)
    .eq('fechaLimite', formatDateDash(date))
    .eq('idUsuario', uuid)
  if (error) console.log(error)
}

const formatDateDashARG = (date: Date) => {
  // Funcion que nos permite pasar de un objeto tipo date a uno de tipo string en formato DD-MM-YYYY
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${day}-${month}-${year}`
}

function obtenerClaveMayorValor(map: Map<string, number>): string {
  // Dado un mapa que tiene una clave de tipo string y un valor de tipo number, retorna la clave que tiene el mayor valor
  let claveMax = ''
  let valorMax: number | null = null

  for (const [clave, valor] of map) {
    if (valorMax === null || valor > valorMax) {
      valorMax = valor
      claveMax = clave
    }
  }

  return claveMax
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getElementNameById(id: number, list: any[]): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const element = list.find(element => element.id === id)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return element.name
}

function convertirAFecha(fechaStr: string): Date {
  //Dada una fecha cualquiera en string en formato americano, sea separada por - o por /, la convierte a un objeto del tipo date de la fecha exacta

  const formatoNormalizado: string = fechaStr.replace('-', '/')

  const fecha = new Date(formatoNormalizado)

  if (isNaN(fecha.getTime())) {
    throw new Error('Fecha no válida')
  }

  return fecha
}

async function recoverObjectiveFromId(objectiveId: number) {
  //Busca en la tabla de objetivos EL objetivo con la misma ID que le hemos pasado. Si devuelve algo, lo hace en forma de lista con un único elemento, si no
  //devuelve una lista vacía
  const { data, error } = await supabase
    .from('ObjetivosFavoritos')
    .select()
    .eq('id', objectiveId)

  if (error) console.error(error)
  else return data
}

async function gatherEventsOfUser(uuid: string, date?: Date) {
  //Recupera todos los eventos del usuario a partir de una fecha(Si el parámetro date es pasado) o todos los eventos de este usuario, el cual se identifica con la UUID
  if (date) {
    const { data, error } = await supabase
      .from('Eventos')
      .select()
      .eq('idUsuario', uuid)
      .gte('fechaLimite', formatDateDash(date))

    return data as EventToRecover[]
  } else {
    const { data, error } = await supabase
      .from('Eventos')
      .select()
      .eq('idUsuario', uuid)

    return data as EventToRecover[]
  }
}

async function acumulateHoursInSelectedEvent(
  //Guarda el valor de pasado en la función como timeToSave en el evento que coincida ser el del nombre y fecha pasados por parametro, y además que sea del usuario identificado por la UUID
  timeToSave: number,
  uuid: string,
  name: string,
  date: Date
) {
  const dateFormatted = formatDateDash(date)
  const { data, error } = await supabase
    .from('Eventos')
    .update({ horasAcumuladas: timeToSave })
    .eq('idUsuario', uuid)
    .eq('nombre', name)
    .eq('fechaLimite', dateFormatted)
    .select()

  if (error) throw error
  return data as unknown[]
}

function getSelectedMusic(title: string) {
  // Pasandole el nombre de la playlist en cuestion de las creadas, devuelve la id que tiene la misma en la BD para que lo que guardemos haga referencia a esa tabla
  let musicaSeleccionada = 0
  switch (title) {
    case 'CapyEpic': {
      const musicID = 1
      musicaSeleccionada = musicID
      break
    }
    case 'CapySynthwave': {
      const musicID = 2
      musicaSeleccionada = musicID
      break
    }
    case 'CapyChill': {
      const musicID = 3
      musicaSeleccionada = musicID
      break
    }
    case 'CapyAmbiente': {
      const musicID = 4
      musicaSeleccionada = musicID
      break
    }
    default: {
      const musicID = 0
      musicaSeleccionada = musicID
      break
    }
  }

  return musicaSeleccionada
}

async function getObjectiveByName(objectiveName: string, uuid: string) {
  //Dado un nombre de un objetivo favorito y un usuario identificado con la UUID, devuelve el objetivo de ese usuario con ese nombre como una lista de un único elemento
  // que contendra al objetivo, si este existiera, en caso de que no, devuelve una lista vacia
  const { data, error } = await supabase
    .from('ObjetivosFavoritos')
    .select()
    .eq('descripcion', objectiveName)
    .eq('idUsuario', uuid)

  if (data) return data
  else console.log(error)
}

async function acumulateHoursInFavouriteObj(
  //Dado un objetivo, un usuario y un tiempo a guardar, guarda el nuevo tiempo en el parámetro de horasAcumuladas del mismo y si se le pasa una id de evento seleccionado
  // crea una referencia en la tabla de ObjetivosFavoritosXEventos para que quede referenciado que en ESE evento se realizó ESE objetivo
  objName: string,
  time: number,
  uuid: string,
  eventId?: number
) {
  const { error } = await supabase
    .from('ObjetivosFavoritos')
    .update({ horasAcumuladas: time })
    .eq('descripcion', objName)
    .eq('idUsuario', uuid)

  if (error) throw error
  if (eventId) {
    const ObjetivoMarcado = (await getObjectiveByName(objName, uuid)) as
      { id: number }[] | undefined
    const idObjetivoMarcado = ObjetivoMarcado?.[0]?.id
    if (idObjetivoMarcado === undefined) {
      throw new Error(`No se encontró el objetivo favorito "${objName}"`)
    }
    const { error } = await supabase
      .from('ObjetivosFavoritosXEventos')
      .insert([{ idEvento: eventId, idObjetivoFavorito: idObjetivoMarcado }])
    if (error) throw error
  }
}

export async function getProgresoInsignia(
  idInsignia: number,
  datosNuevosInsignias: DatosInsignias,
  events: Event[],
  session: Session
) {
  if (idInsignia !== ID_INSIGNIA_INACTIVIDAD) {
    return calcularProgresoInsignia(
      idInsignia,
      datosNuevosInsignias,
      events,
      new Date()
    )
  }

  const { data, error } = await supabase
    .from('SesionesDeEstudio')
    .select('fecha,horaInicioSesion')
    .eq('idUsuario', session.user.id)

  if (error) throw error

  const sesiones: SesionParaInactividad[] = data
  return calcularProgresoInactividad(sesiones, new Date())
}

async function insigniaQuince(session: Session) {
  const { data, error } = await supabase
    .from('CapyInsigniasXUsuarios')
    .select()
    .eq('idUsuario', session.user.id)
    .eq('idInsignia', ID_INSIGNIA_INACTIVIDAD)

  if (error) throw error

  // Un usuario nuevo puede no tener fila de progreso todavía
  const filaActual = (data as InsigniaXUsuario[]).at(0)
  if (filaActual?.progreso === 100) return true

  const progreso = await getProgresoInsignia(
    ID_INSIGNIA_INACTIVIDAD,
    {
      objetivosSesion: 0,
      objetivosCumplidosSesion: 0,
      sesionesDeEstudio: 0,
      sesionesNegativas: 0,
      sesionesPositivas: 0,
      objetivosCumplidos: 0,
      tiempoEstudiado: 0,
    },
    [],
    session
  )

  if (progreso === (filaActual?.progreso ?? 0)) return false

  const { error: saveError } =
    filaActual === undefined
      ? await supabase.from('CapyInsigniasXUsuarios').upsert({
          idInsignia: ID_INSIGNIA_INACTIVIDAD,
          idUsuario: session.user.id,
          progreso,
        })
      : await supabase
          .from('CapyInsigniasXUsuarios')
          .update({ progreso })
          .eq('idUsuario', session.user.id)
          .eq('idInsignia', ID_INSIGNIA_INACTIVIDAD)

  if (saveError) throw saveError

  return false
}

// Implementación de SessionRepository sobre Supabase: cada método rechaza ante un error
const supabaseSessionRepository: SessionRepository = {
  async insertSesion(row) {
    const { error } = await supabase.from('SesionesDeEstudio').insert([row])
    if (error) throw error
  },

  async getAgregadosUsuario(userId) {
    const { data, error } = await supabase
      .from('Usuarios')
      .select(
        'objetivosCumplidos,sesionesDeEstudio,sesionesPositivas,sesionesNegativas'
      )
      .eq('id', userId)
    if (error) throw error
    return ((data as AgregadosUsuario[] | null) ?? [])[0] ?? null
  },

  // Un UPDATE que no coincide con ninguna fila no devuelve error: se verifica con .select()
  async updateAgregadosUsuario(userId, agregados) {
    const { data, error } = await supabase
      .from('Usuarios')
      .update(agregados)
      .eq('id', userId)
      .select('id')
    if (error) throw error
    if ((data as unknown[]).length === 0) {
      throw new Error('No se actualizaron los datos del usuario')
    }
  },

  async updateHorasEvento(userId, evento, horas) {
    const filas = await acumulateHoursInSelectedEvent(
      horas,
      userId,
      evento.title,
      evento.date
    )
    if (filas.length === 0) {
      throw new Error(`No se encontró el evento "${evento.title}"`)
    }
  },

  async getProgresoInsignias(userId) {
    const { data, error } = await supabase
      .from('CapyInsigniasXUsuarios')
      .select('idInsignia,progreso')
      .eq('idUsuario', userId)
    if (error) throw error
    const filas: ProgresoInsignia[] = data
    return filas
  },

  async upsertProgresoInsignia(userId, { idInsignia, progreso }) {
    const { error } = await supabase
      .from('CapyInsigniasXUsuarios')
      .upsert({ idInsignia, idUsuario: userId, progreso })
      .eq('idInsignia', idInsignia)
      .eq('idUsuario', userId)
      .neq('progreso', 100)
    if (error) throw error
  },
}

function buildSaveSessionJob(
  sessionToSave: SesionAGuardar,
  {
    motivationType,
    insignias,
    events,
    selectedEvent,
  }: {
    motivationType: string
    insignias: Insignia[]
    events: Event[]
    selectedEvent?: Event | null
  }
) {
  return createSaveSessionJob({
    sesion: buildSesionRow(sessionToSave),
    motivationType,
    insigniaIds: insignias.map(insignia => insignia.id),
    events,
    evento: selectedEvent
      ? {
          id: selectedEvent.id,
          title: selectedEvent.title,
          date: selectedEvent.date,
          horasPrevias: selectedEvent.hoursAcumulated ?? 0,
        }
      : null,
  })
}

// Ejecuta o reintenta un job. Rechaza con SaveSessionError si algún paso falla.
function runSaveSession(job: SaveSessionJob) {
  return runSaveSessionJob(job, supabaseSessionRepository)
}

// Guarda la sesión, los agregados del usuario y el progreso de insignias.
// Resuelve cuando todas las escrituras terminaron y rechaza ante cualquier error.
// Para poder reintentar sin duplicar escrituras, usar buildSaveSessionJob + runSaveSession.
async function saveSession(
  sessionToSave: SesionAGuardar,
  // Se conserva por compatibilidad; la duración sale de sessionToSave.tiempoEstudio
  _datosSesion: { objCumplidos: number; hoy: Date; InicioSesion: Date },
  {
    session,
    motivationType,
    insignias,
    events,
  }: {
    session: Session | null
    motivationType: string
    insignias: Insignia[]
    events: Event[]
  }
) {
  if (!session) return

  await runSaveSession(
    buildSaveSessionJob(sessionToSave, { motivationType, insignias, events })
  )
}

export {
  acumulateHoursInFavouriteObj,
  acumulateHoursInSelectedEvent,
  convertirAFecha,
  dateToTimetz,
  deleteEvent,
  formatDateDash,
  formatDateDashARG,
  formatDateSlash,
  gatherEventsOfUser,
  getElementNameById,
  getObjectiveByName,
  getSelectedMusic,
  obtenerClaveMayorValor,
  recoverObjectiveFromId,
  saveSession,
  buildSaveSessionJob,
  runSaveSession,
  insigniaQuince,
}
