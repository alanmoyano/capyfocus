import { Insignia } from '@/components/contexts/InsigniasContext'
import { supabase } from '@/components/supabase/client'
import type { Session } from '@supabase/supabase-js'
import type { Event } from '@/components/ComponentesEspecifico/Eventos'

type EventToRecover = {
  idEvento: number
  nombre: string
  idUsuario: string
  fechaLimite: string
  horasAcumuladas: number | null
}

export type objetivoARecuperar = {
  id: number
  descripcion: string
  idUsuario: string
  horasAcumuladas: number
  idEstado: number
}

export type ObjetivoCompletadoAGuardar = {
  descripcion: string
  horasAcumuladas: number
  idObjetivo: number
}

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

const formatDateDash = (date: Date) => {
  // Función que nos permite pasar de un objeto tipo date a uno de tipo string en formato YYYY-MM-DD
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
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

  return data
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

async function getObjectivesCompletedByName(
  objectiveName: string,
  uuid: string
) {
  //Dado un nombre de un objetivo favorito y un usuario identificado con la UUID, devuelve todos los objetivos completados que tengan ese nombre

  const { data, error } = await supabase
    .from('ObjetivosFavoritos')
    .select()
    .eq('descripcion', objectiveName)
    .eq('idUsuario', uuid)
    .eq('idEstado', 2)

  if (data) return data
  else console.log(error)
}

async function unCompleteObjectiveByNameAndId(uuid: string, id: number) {
  //Dado un nombre de un objetivo favorito y un usuario identificado con la UUID, cambia el estado del objetivo que tiene como id, el id pasado por parámetro
  const { data, error } = await supabase
    .from('ObjetivosFavoritos')
    .update({ idEstado: 1 })
    .eq('idUsuario', uuid)
    .eq('id', id)

  if (error) console.log(error)
}

async function acumulateHoursInFavouriteObj(
  //Dado un objetivo, un usuario y un tiempo a guardar, guarda el nuevo tiempo en el parámetro de horasAcumuladas del mismo y si se le pasa una id de evento seleccionado
  // crea una referencia en la tabla de ObjetivosFavoritosXEventos para que quede referenciado que en ESE evento se realizó ESE objetivo
  objName: string,
  time: number,
  uuid: string,
  eventId?: number
) {
  const { data, error } = await supabase
    .from('ObjetivosFavoritos')
    .update({ horasAcumuladas: time })
    .eq('descripcion', objName)
    .eq('idUsuario', uuid)
    .eq('idEstado', 1)

  if (error) console.log(error)
  console.log(eventId)
  if (eventId) {
    const ObjetivoMarcado = await getObjectiveByName(objName, uuid)
    //@ts-expect-error no te preocupes ts, confia en nosotros
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const idObjetivoMarcado = ObjetivoMarcado[0].id
    const { data, error } = await supabase
      .from('ObjetivosFavoritosXEventos')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      .insert([{ idEvento: eventId, idObjetivoFavorito: idObjetivoMarcado }])
    if (error) console.log(error)
  }
}

async function saveSession(
  sessionToSave: SesionAGuardar,
  {
    objCumplidos,
    hoy,
    InicioSesion,
  }: { objCumplidos: number; hoy: Date; InicioSesion: Date },
  {
    session,
    motivationType,
    insignias,
    getProgresoInsignia,
    events,
  }: {
    session: Session | null
    motivationType: string
    insignias: Insignia[]
    getProgresoInsignia: (
      idInsignia: number,
      datosNuevosInsignias: {
        sesionesNegativas: number
        sesionesPositivas: number
        tiempoEstudiado: number
        sesionesDeEstudio: number
        objetivosCumplidos: number
        objetivosSesion: number
      },
      events: Event[]
    ) => number
    events: Event[]
  }
) {
  if (!session) return

  supabase
    .from('SesionesDeEstudio')
    .insert([
      {
        idUsuario: sessionToSave.uuid,
        horaInicioSesion: sessionToSave.horaInicioSesion,
        fecha: sessionToSave.fecha,
        horaFinSesion: sessionToSave.horaFinSesion,
        tecnicaEstudio: sessionToSave.tecnicaEstudio,
        tipoMotivacion: sessionToSave.tipoMotivacion,
        cantidadObjetivosCumplidos: sessionToSave.cantidadObjetivosCumplidos,
        cantidadObjetivos: sessionToSave.cantidadObjetivos,
        tiempoEstudio: sessionToSave.tiempoEstudio,
        musicaSeleccionada: sessionToSave.musicaSeleccionada,
        eventoSeleccionado: sessionToSave.eventoSeleccionado,
      },
    ])
    .select()
    .then(({ data, error }) => {
      if (error) console.log(error)
      else console.log('Datos guardados correctamente', data)
    })

  let capyDatosParaEstadisticas = {
    objetivosCumplidos: 0,
    sesionesDeEstudio: 0,
    sesionesNegativas: 0,
    sesionesPositivas: 0,
  }

  await supabase
    .from('Usuarios')
    .select(
      'objetivosCumplidos,sesionesDeEstudio,sesionesPositivas,sesionesNegativas'
    )
    .eq('id', session.user.id)
    .then(({ data, error }) => {
      if (error) console.error(error)
      if (!data) return

      capyDatosParaEstadisticas = data[0] as typeof capyDatosParaEstadisticas
    })

  console.log('datos totales antes de sumar', capyDatosParaEstadisticas)

  const nuevosCapyDatosParaEstadisticas = {
    objetivosCumplidos:
      capyDatosParaEstadisticas.objetivosCumplidos + objCumplidos,
    sesionesDeEstudio: capyDatosParaEstadisticas.sesionesDeEstudio + 1,
    sesionesPositivas:
      capyDatosParaEstadisticas.sesionesPositivas +
      (motivationType === 'Positiva' ? 1 : 0),
    sesionesNegativas:
      capyDatosParaEstadisticas.sesionesNegativas +
      (motivationType === 'Pasivo Agresiva' ? 1 : 0),
  }

  console.log(nuevosCapyDatosParaEstadisticas)

  supabase
    .from('Usuarios')
    .update(nuevosCapyDatosParaEstadisticas)
    .eq('id', session.user.id)
    .select()
    .then(({ data, error }) => {
      if (error) console.log(error)
      else console.log(data)
    })

  insignias.forEach(insignia => {
    supabase
      .from('CapyInsigniasXUsuarios')
      .upsert({
        idInsignia: insignia.id,
        idUsuario: session.user.id,
        progreso: getProgresoInsignia(
          insignia.id,
          {
            objetivosSesion: sessionToSave.cantidadObjetivos,
            tiempoEstudiado: (hoy.getTime() - InicioSesion.getTime()) / 1000,
            ...nuevosCapyDatosParaEstadisticas,
          },
          events
        ),
      })
      .eq('idInsignia', insignia.id)
      .eq('idUsuario', session.user.id)
      .neq('progreso', 100)
      .select()
      .then(({ data, error }) => {
        if (error) console.error(error)
        console.log(data)
      })
  })
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
  getObjectivesCompletedByName,
  unCompleteObjectiveByNameAndId,
}
