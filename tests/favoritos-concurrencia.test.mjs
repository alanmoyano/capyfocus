import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FavoritosSync } from '../src/lib/inicio/favoritos.ts'
import { buscarEquivalente } from '../src/lib/inicio/objetivos.ts'

const diferida = () => {
  let resolver
  let rechazar
  const promesa = new Promise((resolve, reject) => {
    resolver = resolve
    rechazar = reject
  })
  return { promesa, resolver, rechazar }
}
const turno = () => new Promise(resolve => setImmediate(resolve))

function escenario() {
  const borrado = diferida()
  const alta = diferida()
  let filas = [{ id: 1, descripcion: 'Leer', horasAcumuladas: 10 }]
  let inserciones = 0
  let bajas = 0
  const sync = new FavoritosSync(
    {
      listar: async () => [...filas],
      insertar: async descripcion => {
        inserciones++
        await alta.promesa
        const existente = filas.find(
          fila =>
            buscarEquivalente(descripcion, [fila.descripcion]) !== undefined
        )
        if (existente) return existente
        const nueva = { id: 2, descripcion, horasAcumuladas: 0 }
        filas.push(nueva)
        return nueva
      },
      archivar: async () => {
        bajas++
        await borrado.promesa
        filas = []
      },
    },
    buscarEquivalente
  )
  sync.setIdentidad('usuario-a')
  return {
    sync,
    borrado,
    alta,
    filas: () => filas,
    inserciones: () => inserciones,
    bajas: () => bajas,
  }
}

test('un alta equivalente espera la baja y no reutiliza su fila archivada', async () => {
  const e = escenario()
  await e.sync.cargar()
  const baja = e.sync.quitar('Leer')
  const alta = e.sync.agregar('  leer  ')
  assert.equal(e.sync.tieneBajaPendiente('LEER'), true)
  assert.equal(e.sync.tieneAltaPendiente('Leer'), true)
  await turno()
  assert.equal(e.inserciones(), 0)
  e.borrado.resolver()
  await baja
  e.alta.resolver()
  const resultado = await alta
  assert.equal(resultado.favorito.id, 2)
  assert.equal(e.filas().length, 1)
  assert.equal(e.sync.tieneAltaPendiente('LEER'), false)
  assert.equal(e.sync.tieneBajaPendiente('leer'), false)
})

test('deduplica altas y bajas equivalentes', async () => {
  const e = escenario()
  const alta = e.sync.agregar('Leer')
  assert.equal(e.sync.agregar(' leer '), alta)
  e.alta.resolver()
  await alta
  assert.equal(e.inserciones(), 1)
  const baja = e.sync.quitar('Leer')
  assert.equal(e.sync.quitar(' LEER '), baja)
  e.borrado.resolver()
  await baja
  assert.equal(e.bajas(), 1)
})

test('la baja equivalente espera un alta pendiente', async () => {
  const e = escenario()
  const alta = e.sync.agregar('Leer')
  const baja = e.sync.quitar(' leer ')
  await turno()
  assert.equal(e.bajas(), 0)
  e.alta.resolver()
  await alta
  await turno()
  assert.equal(e.bajas(), 1)
  e.borrado.resolver()
  await baja
  assert.equal(e.filas().length, 0)
})

test('una baja fallida libera pendientes y el alta reutiliza la fila vigente', async () => {
  const e = escenario()
  await e.sync.cargar()
  const baja = e.sync.quitar('Leer')
  const fallo = assert.rejects(baja, /sin conexión/)
  const alta = e.sync.agregar('leer')
  e.borrado.rechazar(new Error('sin conexión'))
  await fallo
  const resultado = await alta
  assert.equal(resultado.estado, 'existente')
  assert.equal(resultado.favorito.id, 1)
  assert.equal(e.sync.tieneBajaPendiente('leer'), false)
})

test('cambiar identidad invalida el alta que esperaba una baja equivalente', async () => {
  const e = escenario()
  const baja = e.sync.quitar('Leer')
  const alta = e.sync.agregar('leer')
  e.sync.setIdentidad('usuario-b')
  e.borrado.resolver()
  assert.equal(await baja, 'obsoleto')
  assert.equal((await alta).estado, 'obsoleto')
  assert.equal(e.inserciones(), 0)
})
