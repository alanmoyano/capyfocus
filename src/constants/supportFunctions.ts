import { supabase } from '@/components/supabase/client'

type EventToRecover = {
  idEvento: number
  nombre: string
  idUsuario: string
  fechaLimite: string
  horasAcumuladas: number | null
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
/* eslint-disable @typescript-eslint/no-unsafe-return */
function dateToTimetz(date: Date | null): string {
  // Obtiene la parte de la hora y la zona horaria
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC', // Cambia esto a la zona horaria que necesites
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  }
  //@ts-expect-error anda, no te preocupes
  return date.toLocaleString('en-US', options)
}

const formatDateSlash = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

const formatDateDash = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const formatDateDashARG = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${day}-${month}-${year}`
}

function obtenerClaveMayorValor(map: Map<string, number>): string {
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
  // Reemplazar los separadores / o - por un solo formato (ej. -)
  const formatoNormalizado: string = fechaStr.replace('-', '/')

  // Crear el objeto Date
  const fecha = new Date(formatoNormalizado)

  // Verificar si la fecha es válida
  if (isNaN(fecha.getTime())) {
    throw new Error('Fecha no válida')
  }

  return fecha
}

async function recoverObjectiveFromId(objectiveId: number) {
  const { data, error } = await supabase
    .from('ObjetivosFavoritos')
    .select()
    .eq('id', objectiveId)

  if (error) console.error(error)
  return data
}

async function gatherEventsOfUser(uuid: string, date?: Date) {
  if (date) {
    const { data, error } = await supabase
      .from('Eventos')
      .select()
      .eq('idUsuario', uuid)
      .gt('fechaLimite', formatDateDash(date))
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
  timeToAcumulate: number,
  uuid: string,
  name: string,
  date: Date
) {
  const dateFormatted = formatDateDash(date)
  const { data, error } = await supabase
    .from('Eventos')
    .update({ horasAcumuladas: timeToAcumulate })
    .eq('idUsuario', uuid)
    .eq('nombre', name)
    .eq('fechaLimite', dateFormatted)

  return data
}

function getSelectedMusic(title: string) {
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
  const { data, error } = await supabase
    .from('ObjetivosFavoritos')
    .select()
    .eq('descripcion', objectiveName)
    .eq('idUsuario', uuid)

  if (data) return data
  else console.log(error)
}

async function acumulateHoursInFavouriteObj(
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

export {
  dateToTimetz,
  formatDateDash,
  formatDateSlash,
  obtenerClaveMayorValor,
  getElementNameById,
  convertirAFecha,
  gatherEventsOfUser,
  getSelectedMusic,
  acumulateHoursInSelectedEvent,
  getObjectiveByName,
  acumulateHoursInFavouriteObj,
  recoverObjectiveFromId,
  formatDateDashARG,
}
