// Cálculo puro del progreso de las CapyInsignias (0 a 100).
// Las descripciones visibles viven en la tabla CapyInsignias; los criterios de
// abajo replican los que ya usaba la aplicación.

export const requisitosInsignias = {
  1: 25, // Estudiar 25 veces con pasivoAgresivo
  2: 25, // Estudiar 25 veces con positiva
  3: 1, // Alcanzar un evento
  4: 2, // Estudiar por 2 horas seguidas (estudio efectivo de una sesión)
  5: 10, // Acumular 10 horas para un evento
  6: 5, // Finalizar 5 sesiones de estudio
  7: 15, // Finalizar 15 sesiones de estudio
  8: 35, // Finalizar 35 sesiones de estudio
  9: 50, // Finalizar 50 sesiones de estudio
  10: 100, // Finalizar 100 sesiones de estudio
  11: 10, // Cumplir todos los objetivos de una sesión (sin uso: el criterio es por sesión)
  12: 35, // Completa 35 objetivos
  13: 75, // Completa 75 objetivos
  14: 100, // Completa 100 objetivos
  15: 30, // Pasa 30 días sin estudiar
}

export const ID_INSIGNIA_INACTIVIDAD = 15

export type DatosInsignias = {
  // Acumulados históricos del usuario, ya incluyendo la sesión actual
  sesionesNegativas: number
  sesionesPositivas: number
  sesionesDeEstudio: number
  objetivosCumplidos: number
  // Datos de la sesión actual
  tiempoEstudiado: number // segundos de estudio efectivo, sin pausas ni descansos
  objetivosSesion: number
  objetivosCumplidosSesion: number
}

export type EventoInsignia = {
  date: Date
  hoursAcumulated?: number
}

export type SesionParaInactividad = {
  fecha: string // YYYY-MM-DD
  horaInicioSesion: string // HH:MM:SS[+TZ]
}

function porcentaje(valor: number, requisito: number) {
  return Math.min(100, Math.round((valor / requisito) * 100))
}

// Calcula el progreso de las insignias que dependen de la sesión que se guarda.
// La 15 depende del historial completo: ver calcularProgresoInactividad.
export function calcularProgresoInsignia(
  idInsignia: number,
  datos: DatosInsignias,
  events: EventoInsignia[],
  ahora: Date
): number {
  switch (idInsignia) {
    case 1:
      return porcentaje(datos.sesionesNegativas, requisitosInsignias[1])

    case 2:
      return porcentaje(datos.sesionesPositivas, requisitosInsignias[2])

    case 3:
      return events.some(event => event.date.getTime() > ahora.getTime())
        ? 100
        : 0

    case 4:
      return datos.tiempoEstudiado >= requisitosInsignias[4] * 60 * 60 ? 100 : 0

    case 5:
      return events.some(
        event =>
          event.hoursAcumulated !== undefined &&
          event.hoursAcumulated >= requisitosInsignias[5] * 60 * 60
      )
        ? 100
        : 0

    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      return porcentaje(
        datos.sesionesDeEstudio,
        requisitosInsignias[idInsignia]
      )

    case 11:
      return datos.objetivosSesion > 0 &&
        datos.objetivosCumplidosSesion >= datos.objetivosSesion
        ? 100
        : 0

    case 12:
    case 13:
    case 14:
      return porcentaje(
        datos.objetivosCumplidos,
        requisitosInsignias[idInsignia]
      )

    default:
      return 1
  }
}

function inicioDeSesion({ fecha, horaInicioSesion }: SesionParaInactividad) {
  const [año, mes, día] = fecha.split('-').map(Number)
  const [horas, minutos, segundos] = horaInicioSesion
    .split(/[+-]/)[0]
    .split(':')
    .map(Number)

  return new Date(año, mes - 1, día, horas, minutos, segundos)
}

// Insignia 15: más de 30 días desde la última sesión registrada.
// Sin sesiones no hay una última sesión desde la cual contar, así que no progresa.
export function calcularProgresoInactividad(
  sesiones: SesionParaInactividad[],
  ahora: Date
): number {
  const inicios = sesiones
    .map(inicioDeSesion)
    .filter(fecha => !isNaN(fecha.getTime()))
  if (inicios.length === 0) return 0

  const ultimaSesion = Math.max(...inicios.map(fecha => fecha.getTime()))
  const limite = requisitosInsignias[15] * 24 * 60 * 60 * 1000

  return ahora.getTime() - ultimaSesion > limite ? 100 : 0
}
