import {
  addDays,
  differenceInCalendarDays,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'

export type PeriodoEstadisticas =
  'semanal' | 'mensual' | 'bimestral' | 'semestre'
export type RangoPeriodo = { desde: Date; hasta: Date }
export type SesionPeriodo = {
  fecha: string
  tecnicaEstudio: number
  tipoMotivacion: number
  musicaSeleccionada: number | null
  cantidadObjetivosCumplidos: number | string
  cantidadObjetivos: number | string
  tiempoEstudio: number
}
export type DiaPeriodo = {
  fecha: string
  objetivosTotales: number
  objetivosCumplidos: number
  tiempoEstudio: number
  cantidadSesiones: number
}
export type BucketPeriodo = {
  date: Date
  label: string
  cumplidos: number
  pendientes: number
}

// Las fechas de la BD son días locales, no timestamps UTC.
export function fechaLocal(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
}

export function parsearFechaLocal(fecha: string): Date {
  const [year, month, day] = fecha.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Semana móvil de 7 días. Los demás períodos incluyen el mes actual
// y los 0/1/5 meses calendario anteriores, siempre hasta hoy inclusive.
export function rangoPeriodo(
  periodo: PeriodoEstadisticas,
  hoy = new Date()
): RangoPeriodo {
  const hasta = startOfDay(hoy)
  const meses = { mensual: 1, bimestral: 2, semestre: 6 }
  const desde =
    periodo === 'semanal'
      ? subDays(hasta, 6)
      : startOfMonth(subMonths(hasta, meses[periodo] - 1))
  return { desde, hasta }
}

export function agruparDias(
  dias: DiaPeriodo[],
  tamaño: number
): BucketPeriodo[] {
  if (!Number.isInteger(tamaño) || tamaño < 1)
    throw new Error('Tamaño de bucket inválido')
  const buckets: BucketPeriodo[] = []
  for (let i = 0; i < dias.length; i += tamaño) {
    const grupo = dias.slice(i, i + tamaño)
    const inicio = parsearFechaLocal(grupo[0].fecha)
    const fin = parsearFechaLocal(grupo[grupo.length - 1].fecha)
    const etiqueta = (date: Date) =>
      date.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric' })
    buckets.push({
      date: inicio,
      label:
        grupo.length === 1
          ? etiqueta(inicio)
          : `${etiqueta(inicio)} al ${etiqueta(fin)}`,
      cumplidos: grupo.reduce(
        (total, dia) => total + dia.objetivosCumplidos,
        0
      ),
      pendientes: grupo.reduce(
        (total, dia) => total + dia.objetivosTotales - dia.objetivosCumplidos,
        0
      ),
    })
  }
  return buckets
}

export function mayorRacha(fechas: string[]): number {
  const ordenadas = [...new Set(fechas)].sort()
  let mayor = 0
  let actual = 0
  ordenadas.forEach((fecha, i) => {
    actual =
      i > 0 &&
      differenceInCalendarDays(
        parsearFechaLocal(fecha),
        parsearFechaLocal(ordenadas[i - 1])
      ) === 1
        ? actual + 1
        : 1
    mayor = Math.max(mayor, actual)
  })
  return mayor
}

function favorito(
  sesiones: SesionPeriodo[],
  campo: 'tipoMotivacion' | 'musicaSeleccionada' | 'tecnicaEstudio',
  nombres: Partial<Record<number, string>>
): string {
  const conteos = new Map<number, number>()
  for (const sesion of sesiones) {
    const id = sesion[campo]
    if (id !== null && nombres[id]) conteos.set(id, (conteos.get(id) ?? 0) + 1)
  }
  if (conteos.size === 0) return 'Sin datos'
  const ganador = [...conteos].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]
  return nombres[ganador[0]] ?? 'Sin datos'
}

export function resumirPeriodo(
  sesiones: SesionPeriodo[],
  rango: RangoPeriodo,
  periodo: PeriodoEstadisticas
) {
  const dias: DiaPeriodo[] = []
  for (
    let fecha = rango.desde;
    fecha <= rango.hasta;
    fecha = addDays(fecha, 1)
  ) {
    dias.push({
      fecha: fechaLocal(fecha),
      objetivosTotales: 0,
      objetivosCumplidos: 0,
      tiempoEstudio: 0,
      cantidadSesiones: 0,
    })
  }
  const porFecha = new Map(dias.map(dia => [dia.fecha, dia]))
  const incluidas = sesiones.filter(sesion => porFecha.has(sesion.fecha))
  for (const sesion of incluidas) {
    const dia = porFecha.get(sesion.fecha)
    if (!dia) continue
    dia.objetivosTotales += Number(sesion.cantidadObjetivos)
    dia.objetivosCumplidos += Number(sesion.cantidadObjetivosCumplidos)
    dia.tiempoEstudio += sesion.tiempoEstudio
    dia.cantidadSesiones++
  }
  const activos = dias.filter(dia => dia.cantidadSesiones > 0)
  const objetivosTotales = dias.reduce(
    (total, dia) => total + dia.objetivosTotales,
    0
  )
  const objetivosCumplidos = dias.reduce(
    (total, dia) => total + dia.objetivosCumplidos,
    0
  )
  return {
    cantidadSesiones: incluidas.length,
    tiempoEstudio: dias.reduce((total, dia) => total + dia.tiempoEstudio, 0),
    objetivosTotales,
    objetivosCumplidos,
    objetivosPendientes: objetivosTotales - objetivosCumplidos,
    motivacion: favorito(incluidas, 'tipoMotivacion', {
      1: 'Positiva',
      2: 'Pasivo Agresiva',
    }),
    musicaFavorita: favorito(incluidas, 'musicaSeleccionada', {
      0: 'Sin música',
      1: 'CapyEpic',
      2: 'CapySynthwave',
      3: 'CapyChill',
      4: 'CapyAmbiente',
    }),
    tecnicaEstudio: favorito(incluidas, 'tecnicaEstudio', {
      1: 'CapyDoro',
      2: 'CapyMetro',
    }),
    racha: mayorRacha(activos.map(dia => dia.fecha)),
    fechasOrdenadas: activos.map(dia => dia.fecha),
    sessionInfoAcumuladas: dias,
    chartData: agruparDias(
      dias,
      periodo === 'semestre' ? 7 : periodo === 'bimestral' ? 2 : 1
    ),
  }
}
