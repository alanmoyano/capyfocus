import { supabase } from "@/components/supabase/client"

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

async function gatherEventsOfUser(uuid: string, date?: Date) {
  if (date) {
    const { data, error } = await supabase
      .from('Eventos')
      .select()
      .eq('idUsuario', uuid)
      .gt('fechaLimite', formatDateDash(date))
    return data
  } else {
    const { data, error } = await supabase
      .from('Eventos')
      .select()
      .eq('idUsuario', uuid)
    return data
  }
}

export {
  dateToTimetz,
  formatDateDash,
  formatDateSlash,
  obtenerClaveMayorValor,
  getElementNameById,
  convertirAFecha,
  gatherEventsOfUser
}
