// Sincronización de objetivos favoritos con el backend, aislada de React para
// poder probarla. El modelo de la app sigue usando el texto como identificador
// (Timer y Pomodoro dependen de eso); acá se guarda además el id remoto de cada
// favorito para operar por id cuando ya se conoce.

export type FavoritoRemoto = {
  id: number
  descripcion: string
  horasAcumuladas: number | null
}

export type FavoritosApi = {
  listar: (uuid: string) => Promise<FavoritoRemoto[]>
  insertar: (descripcion: string, uuid: string) => Promise<FavoritoRemoto>
  archivar: (
    favorito: { id?: number; descripcion: string },
    uuid: string
  ) => Promise<void>
}

// 'obsoleto': la identidad cambió mientras la operación estaba en curso, así
// que el resultado no se tiene que aplicar al estado actual.
export type ResultadoAlta = 'insertado' | 'existente' | 'obsoleto'
export type ResultadoBaja = 'archivado' | 'obsoleto'

export class FavoritosSync {
  private uuid: string | null = null
  // Cambia con cada identidad (incluso A → B → A) para descartar respuestas viejas
  private identidad = 0
  private ultimaCarga = 0
  private ids = new Map<string, number>()
  private carga: Promise<FavoritoRemoto[] | null> | null = null
  private altas = new Map<string, Promise<ResultadoAlta>>()
  private bajas = new Map<string, Promise<ResultadoBaja>>()

  private readonly api: FavoritosApi

  constructor(api: FavoritosApi) {
    this.api = api
  }

  setIdentidad(uuid: string | null) {
    if (uuid === this.uuid) return
    this.uuid = uuid
    this.identidad++
    this.ids.clear()
    this.altas.clear()
    this.bajas.clear()
    this.carga = null
  }

  identidadActual() {
    return this.uuid
  }

  idDe(descripcion: string) {
    return this.ids.get(descripcion)
  }

  tieneAltaPendiente(descripcion: string) {
    return this.altas.has(descripcion)
  }

  tieneBajaPendiente(descripcion: string) {
    return this.bajas.has(descripcion)
  }

  // Devuelve null si la respuesta llegó tarde (cambió la identidad o hubo una
  // carga más nueva). Los errores se propagan para que la UI los muestre.
  cargar(): Promise<FavoritoRemoto[] | null> {
    const uuid = this.uuid
    if (!uuid) return Promise.resolve(null)
    const identidad = this.identidad
    const numeroCarga = ++this.ultimaCarga
    const vigente = () =>
      identidad === this.identidad && numeroCarga === this.ultimaCarga
    const carga = this.api.listar(uuid).then(
      favoritos => {
        if (!vigente()) return null
        favoritos.forEach(favorito => {
          this.ids.set(favorito.descripcion, favorito.id)
        })
        return favoritos
      },
      (error: unknown) => {
        if (!vigente()) return null
        throw error
      }
    )
    this.carga = carga
    return carga
  }

  // Una sola alta en vuelo por texto, y siempre después de la carga en curso:
  // si el texto ya era favorito no se vuelve a insertar.
  agregar(descripcion: string): Promise<ResultadoAlta> {
    const pendiente = this.altas.get(descripcion)
    if (pendiente) return pendiente

    const uuid = this.uuid
    const identidad = this.identidad
    const carga = this.carga
    const baja = this.bajas.get(descripcion)
    const alta = (async (): Promise<ResultadoAlta> => {
      if (!uuid) return 'obsoleto'
      if (carga) await carga.catch(() => null)
      // Si se está archivando el mismo texto, esperar para no reutilizar su id
      if (baja) await baja.catch(() => null)
      if (identidad !== this.identidad) return 'obsoleto'
      if (this.ids.has(descripcion)) return 'existente'
      let favorito: FavoritoRemoto
      try {
        favorito = await this.api.insertar(descripcion, uuid)
      } catch (error) {
        if (identidad !== this.identidad) return 'obsoleto'
        throw error
      }
      if (identidad !== this.identidad) return 'obsoleto'
      this.ids.set(favorito.descripcion, favorito.id)
      return 'insertado'
    })().finally(() => {
      if (this.altas.get(descripcion) === alta) this.altas.delete(descripcion)
    })
    this.altas.set(descripcion, alta)
    return alta
  }

  quitar(descripcion: string): Promise<ResultadoBaja> {
    const pendiente = this.bajas.get(descripcion)
    if (pendiente) return pendiente

    const uuid = this.uuid
    const identidad = this.identidad
    const altaPrevia = this.altas.get(descripcion)
    const baja = (async (): Promise<ResultadoBaja> => {
      if (!uuid) return 'obsoleto'
      // Si el alta todavía está en vuelo, esperarla para archivar por id
      if (altaPrevia) await altaPrevia.catch(() => null)
      if (identidad !== this.identidad) return 'obsoleto'
      try {
        await this.api.archivar(
          { id: this.ids.get(descripcion), descripcion },
          uuid
        )
      } catch (error) {
        if (identidad !== this.identidad) return 'obsoleto'
        throw error
      }
      if (identidad !== this.identidad) return 'obsoleto'
      this.ids.delete(descripcion)
      return 'archivado'
    })().finally(() => {
      if (this.bajas.get(descripcion) === baja) this.bajas.delete(descripcion)
    })
    this.bajas.set(descripcion, baja)
    return baja
  }
}

// Lista visible de favoritos tras una carga: lo remoto es la fuente de verdad,
// salvo los textos con una operación local todavía en vuelo (una baja en curso
// no reaparece y un alta en curso no desaparece).
export function combinarFavoritos(
  remotos: readonly FavoritoRemoto[],
  locales: readonly string[],
  pendientes: Pick<FavoritosSync, 'tieneAltaPendiente' | 'tieneBajaPendiente'>
) {
  const resultado = remotos
    .map(favorito => favorito.descripcion)
    .filter(descripcion => !pendientes.tieneBajaPendiente(descripcion))
  locales.forEach(descripcion => {
    if (pendientes.tieneAltaPendiente(descripcion)) resultado.push(descripcion)
  })
  return [...new Set(resultado)]
}

// Tiempo acumulado por favorito: se toma el mayor entre lo local y lo remoto
// para no pisar tiempo de una sesión recién terminada con una lectura vieja.
export function combinarTiempoFavorito(
  previo: Record<string, number>,
  remotos: readonly FavoritoRemoto[]
) {
  const siguiente = { ...previo }
  remotos.forEach(({ descripcion, horasAcumuladas }) => {
    siguiente[descripcion] = Math.max(
      previo[descripcion] ?? 0,
      horasAcumuladas ?? 0
    )
  })
  return siguiente
}
