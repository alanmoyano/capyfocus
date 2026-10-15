// Límites de los selectores de minutos del Capydoro, en segundos.
export const MINIMO_SEGUNDOS = 60
export const MAXIMO_SEGUNDOS = 180 * 60
export const PASO_SEGUNDOS = 60

export function ajustarSegundos(
  actual: number,
  delta: number,
  minimo = MINIMO_SEGUNDOS,
  maximo = MAXIMO_SEGUNDOS
) {
  return Math.min(maximo, Math.max(minimo, actual + delta))
}
