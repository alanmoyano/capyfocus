// Reglas de los objetivos de una sesión. Los objetivos se identifican por su
// texto (Timer y Pomodoro usan el texto como clave), así que el texto tiene que
// ser único, no vacío y estar normalizado igual en todos los caminos de alta.

export const MAX_OBJETIVOS = 10

export type ErrorObjetivo = 'vacio' | 'duplicado' | 'limite'

export type ResultadoObjetivo =
  { ok: true; valor: string } | { ok: false; error: ErrorObjetivo }

export const mensajesErrorObjetivo: Record<ErrorObjetivo, string> = {
  vacio: 'Escribí un objetivo antes de agregarlo.',
  duplicado: 'Ese objetivo ya está en la lista.',
  limite: `Llegaste al límite de ${MAX_OBJETIVOS} objetivos. Si necesitás más, quizás convenga dividirlo en otra sesión.`,
}

// Quita espacios en los extremos y colapsa los espacios internos repetidos
export function normalizarObjetivo(texto: string) {
  return texto.trim().replace(/\s+/g, ' ')
}

function claveComparacion(texto: string) {
  return normalizarObjetivo(texto).toLocaleLowerCase('es')
}

export function esObjetivoDuplicado(
  texto: string,
  objetivos: readonly string[],
  indiceIgnorado?: number
) {
  const clave = claveComparacion(texto)
  return objetivos.some(
    (objetivo, i) =>
      i !== indiceIgnorado && claveComparacion(objetivo) === clave
  )
}

// Devuelve el texto exacto de un elemento equivalente (mismo texto normalizado).
// Sirve para reutilizar la descripción remota de un favorito guardado con
// otros espacios, ya que los helpers compartidos la buscan por igualdad exacta.
export function buscarEquivalente(texto: string, lista: readonly string[]) {
  const clave = claveComparacion(texto)
  return lista.find(item => claveComparacion(item) === clave)
}

// Valida un objetivo nuevo (escrito a mano o elegido desde favoritos)
export function validarNuevoObjetivo(
  texto: string,
  objetivos: readonly string[]
): ResultadoObjetivo {
  const valor = normalizarObjetivo(texto)
  if (valor === '') return { ok: false, error: 'vacio' }
  if (esObjetivoDuplicado(valor, objetivos)) {
    return { ok: false, error: 'duplicado' }
  }
  if (objetivos.length >= MAX_OBJETIVOS) return { ok: false, error: 'limite' }
  return { ok: true, valor }
}

// Valida el nuevo texto de un objetivo existente. Editar no cambia la cantidad,
// así que el límite no aplica, pero sí el vacío y los duplicados con el resto.
export function validarEdicionObjetivo(
  texto: string,
  objetivos: readonly string[],
  indice: number
): ResultadoObjetivo {
  const valor = normalizarObjetivo(texto)
  if (valor === '') return { ok: false, error: 'vacio' }
  if (esObjetivoDuplicado(valor, objetivos, indice)) {
    return { ok: false, error: 'duplicado' }
  }
  return { ok: true, valor }
}

// Renombra una clave de un registro (tiempos por objetivo) sin perder su valor
export function renombrarClave<T>(
  registro: Record<string, T>,
  anterior: string,
  nuevo: string
): Record<string, T> {
  if (anterior === nuevo || !(anterior in registro)) return registro
  const { [anterior]: valor, ...resto } = registro
  return { ...resto, [nuevo]: valor }
}

export function renombrarEnLista(
  lista: string[],
  anterior: string,
  nuevo: string
) {
  return lista.includes(anterior)
    ? lista.map(item => (item === anterior ? nuevo : item))
    : lista
}
