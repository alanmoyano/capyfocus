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
function dateToTimetz(date: Date | null): string {// funcion que es necesaria para guardar horas dentro de la bd, ya que el tiempo que pide es Timetz
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

const formatDateSlash = (date: Date) => {// Función que nos permite pasar de un objeto tipo date a uno de tipo string en formato YYYY/MM/DD
  // Esta es LA FUNCIÓN A USAR si queremos guardar fechas en algún lado, porque asi es más fácil recuperarlas y transformarlas en objetos tipo DATE
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

const formatDateDash = (date: Date) => {// Función que nos permite pasar de un objeto tipo date a uno de tipo string en formato YYYY-MM-DD
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const formatDateDashARG = (date: Date) => {// Funcion que nos permite pasar de un objeto tipo date a uno de tipo string en formato DD-MM-YYYY
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

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function getElementNameById(id: number, list: any[]): string {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//   const element = list.find(element => element.id === id)
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//   return element.name
// }

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
