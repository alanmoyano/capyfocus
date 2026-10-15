// Reglas locales de los eventos de Inicio, sin dependencias de React ni de
// Supabase.

export type EventoLocal = {
  id: number
  date: Date
  title: string
  hoursAcumulated?: number
  // true si el evento sólo existe en memoria (usuario invitado)
  temporal?: boolean
}

export type EventoRemoto = {
  idEvento: number
  nombre: string
  fechaLimite: string
  horasAcumuladas: number | null
}

export type ErrorEvento = 'sinTitulo' | 'sinFecha' | 'fechaPasada' | 'duplicado'

export type ResultadoEvento =
  | { ok: true; titulo: string; fecha: Date }
  | { ok: false; error: ErrorEvento }

export const mensajesErrorEvento: Record<ErrorEvento, string> = {
  sinTitulo: 'Ingresá un título para el evento.',
  sinFecha: 'Elegí una fecha en el calendario.',
  fechaPasada: 'La fecha del evento no puede ser anterior a hoy.',
  duplicado: 'Ya tenés un evento con ese nombre en esa fecha.',
}

export function normalizarTitulo(titulo: string) {
  return titulo.trim().replace(/\s+/g, ' ')
}

function inicioDelDia(fecha: Date) {
  const copia = new Date(fecha)
  copia.setHours(0, 0, 0, 0)
  return copia
}

export function mismoDia(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

// Nombre y fecha identifican al evento en los helpers compartidos que
// acumulan horas, así que no se permiten dos eventos iguales el mismo día.
export function validarEvento(
  titulo: string,
  fecha: Date | undefined,
  eventos: readonly EventoLocal[],
  hoy = new Date()
): ResultadoEvento {
  const tituloNormalizado = normalizarTitulo(titulo)
  if (tituloNormalizado === '') return { ok: false, error: 'sinTitulo' }
  if (!fecha) return { ok: false, error: 'sinFecha' }
  if (inicioDelDia(fecha) < inicioDelDia(hoy)) {
    return { ok: false, error: 'fechaPasada' }
  }
  const clave = tituloNormalizado.toLocaleLowerCase('es')
  const duplicado = eventos.some(
    evento =>
      mismoDia(evento.date, fecha) &&
      normalizarTitulo(evento.title).toLocaleLowerCase('es') === clave
  )
  if (duplicado) return { ok: false, error: 'duplicado' }
  return { ok: true, titulo: tituloNormalizado, fecha }
}

// fechaLimite es una fecha sin hora: se envía como YYYY-MM-DD en hora local.
// Enviar el Date serializado (UTC) puede guardar el día siguiente por la noche.
export function fechaLimiteDesdeFecha(fecha: Date) {
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// fechaLimite llega como YYYY-MM-DD; con barras se interpreta en hora local
export function eventoDesdeRemoto(evento: EventoRemoto): EventoLocal {
  return {
    id: evento.idEvento,
    date: new Date(evento.fechaLimite.replaceAll('-', '/')),
    title: evento.nombre,
    hoursAcumulated: evento.horasAcumuladas ?? undefined,
  }
}

// Combina un evento local con su fila remota. Las horas acumuladas sólo
// crecen: se toma el máximo para no perder un total optimista que Timer o
// Pomodoro todavía están escribiendo, ni uno más nuevo sumado en otra pestaña
export function fusionarEvento(
  local: EventoLocal,
  remoto: EventoLocal
): EventoLocal {
  const horas =
    local.hoursAcumulated === undefined && remoto.hoursAcumulated === undefined
      ? undefined
      : Math.max(local.hoursAcumulated ?? 0, remoto.hoursAcumulated ?? 0)
  return { ...local, ...remoto, hoursAcumulated: horas }
}

// Agrega o actualiza por id: una recuperación tardía no duplica, y la fila
// remota actualiza los datos locales, que Timer/Pomodoro usan como base
export function agregarEventos(
  eventos: EventoLocal[],
  nuevos: readonly EventoLocal[]
) {
  if (nuevos.length === 0) return eventos
  const siguiente = [...eventos]
  nuevos.forEach(nuevo => {
    const indice = siguiente.findIndex(evento => evento.id === nuevo.id)
    if (indice === -1) siguiente.push(nuevo)
    else siguiente[indice] = fusionarEvento(siguiente[indice], nuevo)
  })
  return siguiente
}

// Los eventos temporales usan ids negativos para no chocar con los remotos
let ultimoIdTemporal = 0
export function crearEventoTemporal(titulo: string, fecha: Date): EventoLocal {
  ultimoIdTemporal--
  return { id: ultimoIdTemporal, date: fecha, title: titulo, temporal: true }
}

export function esEventoTemporal(evento: Pick<EventoLocal, 'id' | 'temporal'>) {
  return evento.temporal === true || evento.id < 0
}
