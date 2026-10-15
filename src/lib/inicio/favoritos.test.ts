// Ejecutar con: node --test 'src/lib/inicio/*.test.ts'
/* eslint-disable @typescript-eslint/no-floating-promises -- describe/it de node:test devuelven promesas que el runner espera */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  combinarFavoritos,
  combinarTiempoFavorito,
  FavoritosSync,
  type FavoritoRemoto,
  type FavoritosApi,
} from './favoritos.ts'

function diferido<T>() {
  let resolve!: (valor: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

function apiFalsa(overrides: Partial<FavoritosApi> = {}) {
  const llamadas = {
    listar: 0,
    insertar: [] as string[],
    archivar: [] as unknown[],
  }
  let siguienteId = 100
  const api: FavoritosApi = {
    listar:
      overrides.listar ??
      (() => {
        llamadas.listar++
        return Promise.resolve([])
      }),
    insertar: (descripcion, uuid) => {
      llamadas.insertar.push(descripcion)
      if (overrides.insertar) return overrides.insertar(descripcion, uuid)
      return Promise.resolve({
        id: siguienteId++,
        descripcion,
        horasAcumuladas: 0,
      })
    },
    archivar: (favorito, uuid) => {
      llamadas.archivar.push(favorito)
      if (overrides.archivar) return overrides.archivar(favorito, uuid)
      return Promise.resolve()
    },
  }
  return { api, llamadas }
}

const remoto = (
  id: number,
  descripcion: string,
  horas = 0
): FavoritoRemoto => ({
  id,
  descripcion,
  horasAcumuladas: horas,
})

describe('FavoritosSync', () => {
  it('una carga fallida de una identidad anterior devuelve null', async () => {
    const lenta = diferido<FavoritoRemoto[]>()
    const { api } = apiFalsa({ listar: () => lenta.promise })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    const carga = sync.cargar()
    sync.setIdentidad(null)
    lenta.reject(new Error('red'))
    assert.equal(await carga, null)
  })

  it('descarta una carga lenta de una identidad anterior', async () => {
    const lenta = diferido<FavoritoRemoto[]>()
    const { api } = apiFalsa({
      listar: uuid =>
        uuid === 'a' ? lenta.promise : Promise.resolve([remoto(2, 'De B')]),
    })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    const cargaA = sync.cargar()
    sync.setIdentidad('b')
    const cargaB = sync.cargar()
    lenta.resolve([remoto(1, 'De A')])

    assert.equal(await cargaA, null)
    assert.deepEqual(await cargaB, [remoto(2, 'De B')])
    assert.equal(sync.idDe('De A'), undefined)
    assert.equal(sync.idDe('De B'), 2)
  })

  it('descarta respuestas aunque se vuelva a la misma identidad (A → B → A)', async () => {
    const lenta = diferido<FavoritoRemoto[]>()
    let llamada = 0
    const { api } = apiFalsa({
      listar: () => (llamada++ === 0 ? lenta.promise : Promise.resolve([])),
    })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    const vieja = sync.cargar()
    sync.setIdentidad('b')
    sync.setIdentidad('a')
    await sync.cargar()
    lenta.resolve([remoto(1, 'Viejo')])
    assert.equal(await vieja, null)
    assert.equal(sync.idDe('Viejo'), undefined)
  })

  it('no inserta un texto que ya era favorito aunque la carga sea lenta', async () => {
    const lenta = diferido<FavoritoRemoto[]>()
    const { api, llamadas } = apiFalsa({ listar: () => lenta.promise })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    void sync.cargar()
    const alta = sync.agregar('Leer')
    lenta.resolve([remoto(7, 'Leer', 30)])

    assert.deepEqual(await alta, {
      estado: 'existente',
      favorito: remoto(7, 'Leer', 30),
    })
    assert.deepEqual(llamadas.insertar, [])
    assert.equal(sync.idDe('Leer'), 7)
  })

  it('evita la carrera de doble alta del primer favorito', async () => {
    const insert = diferido<FavoritoRemoto>()
    const { api, llamadas } = apiFalsa({ insertar: () => insert.promise })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    await sync.cargar()
    const primera = sync.agregar('Nuevo')
    const segunda = sync.agregar('Nuevo')
    assert.equal(primera, segunda)
    insert.resolve(remoto(9, 'Nuevo'))
    assert.equal((await primera).estado, 'insertado')
    assert.deepEqual(llamadas.insertar, ['Nuevo'])
    assert.equal(sync.tieneAltaPendiente('Nuevo'), false)
  })

  it('archiva por id remoto cuando lo conoce', async () => {
    const { api, llamadas } = apiFalsa({
      listar: () => Promise.resolve([remoto(4, 'Leer')]),
    })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    await sync.cargar()
    assert.equal(await sync.quitar('Leer'), 'archivado')
    assert.deepEqual(llamadas.archivar, [{ id: 4, descripcion: 'Leer' }])
    assert.equal(sync.idDe('Leer'), undefined)
  })

  it('quitar espera el alta en vuelo para usar su id', async () => {
    const insert = diferido<FavoritoRemoto>()
    const { api, llamadas } = apiFalsa({ insertar: () => insert.promise })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    await sync.cargar()
    const alta = sync.agregar('X')
    const baja = sync.quitar('X')
    insert.resolve(remoto(11, 'X'))
    await alta
    assert.equal(await baja, 'archivado')
    assert.deepEqual(llamadas.archivar, [{ id: 11, descripcion: 'X' }])
  })

  it('propaga errores de alta y libera el pendiente para reintentar', async () => {
    let falla = true
    const { api, llamadas } = apiFalsa({
      insertar: descripcion =>
        falla
          ? Promise.reject(new Error('red'))
          : Promise.resolve(remoto(1, descripcion)),
    })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    await sync.cargar()
    await assert.rejects(sync.agregar('Y'), /red/)
    assert.equal(sync.tieneAltaPendiente('Y'), false)
    falla = false
    assert.equal((await sync.agregar('Y')).estado, 'insertado')
    assert.equal(llamadas.insertar.length, 2)
  })

  it('propaga errores de baja y conserva el id para reintentar', async () => {
    let falla = true
    const { api } = apiFalsa({
      listar: () => Promise.resolve([remoto(3, 'Z')]),
      archivar: () =>
        falla ? Promise.reject(new Error('red')) : Promise.resolve(),
    })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    await sync.cargar()
    await assert.rejects(sync.quitar('Z'), /red/)
    assert.equal(sync.idDe('Z'), 3)
    falla = false
    assert.equal(await sync.quitar('Z'), 'archivado')
  })

  it('un error de una identidad anterior no se propaga', async () => {
    const insert = diferido<FavoritoRemoto>()
    const lenta = diferido<FavoritoRemoto[]>()
    const { api, llamadas } = apiFalsa({
      listar: () => lenta.promise,
      insertar: () => insert.promise,
    })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    const carga = sync.cargar()
    lenta.resolve([])
    await carga
    const alta = sync.agregar('A')
    // Dejar que el alta llegue a llamar a insertar antes de cambiar de usuario
    await new Promise(resolve => setTimeout(resolve, 0))
    sync.setIdentidad('b')
    assert.deepEqual(llamadas.insertar, ['A'])
    insert.reject(new Error('red'))
    assert.deepEqual(await alta, { estado: 'obsoleto' })
  })

  it('un alta que reutiliza la fila remota devuelve sus horas', async () => {
    const { api } = apiFalsa({
      listar: () => Promise.reject(new Error('red')),
      insertar: descripcion => Promise.resolve(remoto(5, descripcion, 900)),
    })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    await assert.rejects(sync.cargar(), /red/)
    const alta = await sync.agregar('Leer')
    assert.ok(alta.estado !== 'obsoleto')
    assert.equal(alta.favorito.horasAcumuladas, 900)
  })

  it('una carga leída antes de archivar no restaura el favorito', async () => {
    const lenta = diferido<FavoritoRemoto[]>()
    let llamada = 0
    const { api } = apiFalsa({
      listar: () =>
        llamada++ === 0
          ? Promise.resolve([remoto(1, 'A'), remoto(2, 'B')])
          : lenta.promise,
    })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    await sync.cargar()
    const recarga = sync.cargar()
    assert.equal(await sync.quitar('A'), 'archivado')
    lenta.resolve([remoto(1, 'A'), remoto(2, 'B')])
    assert.deepEqual(await recarga, [remoto(2, 'B')])
    assert.equal(sync.idDe('A'), undefined)
  })

  it('invalidar descarta respuestas pendientes aunque la identidad sea la misma', async () => {
    const lenta = diferido<FavoritoRemoto[]>()
    const { api } = apiFalsa({ listar: () => lenta.promise })
    const sync = new FavoritosSync(api)
    sync.setIdentidad('a')
    const carga = sync.cargar()
    sync.invalidar()
    lenta.resolve([remoto(1, 'A')])
    assert.equal(await carga, null)
    assert.equal(sync.identidadActual(), null)
    assert.deepEqual(await sync.agregar('A'), { estado: 'obsoleto' })
  })

  it('sin identidad no toca el backend', async () => {
    const { api, llamadas } = apiFalsa()
    const sync = new FavoritosSync(api)
    assert.equal(await sync.cargar(), null)
    assert.deepEqual(await sync.agregar('A'), { estado: 'obsoleto' })
    assert.equal(await sync.quitar('A'), 'obsoleto')
    assert.equal(llamadas.listar, 0)
    assert.deepEqual(llamadas.insertar, [])
  })
})

describe('combinarFavoritos', () => {
  const pendientes = (altas: string[], bajas: string[]) => ({
    tieneAltaPendiente: (d: string) => altas.includes(d),
    tieneBajaPendiente: (d: string) => bajas.includes(d),
  })

  it('usa lo remoto como fuente de verdad sin duplicar', () => {
    assert.deepEqual(
      combinarFavoritos(
        [remoto(1, 'A'), remoto(2, 'B')],
        ['A', 'Viejo'],
        pendientes([], [])
      ),
      ['A', 'B']
    )
  })

  it('conserva altas en vuelo y oculta bajas en vuelo', () => {
    assert.deepEqual(
      combinarFavoritos(
        [remoto(1, 'A'), remoto(2, 'B')],
        ['A', 'Nuevo'],
        pendientes(['Nuevo', 'A'], ['B'])
      ),
      ['A', 'Nuevo']
    )
  })
})

describe('combinarTiempoFavorito', () => {
  it('toma el mayor entre local y remoto', () => {
    assert.deepEqual(
      combinarTiempoFavorito({ A: 50, C: 1 }, [
        remoto(1, 'A', 20),
        { id: 2, descripcion: 'B', horasAcumuladas: null },
      ]),
      { A: 50, B: 0, C: 1 }
    )
  })
})
