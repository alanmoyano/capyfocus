// Ejecutar con: node --test 'src/lib/inicio/*.test.ts'
/* eslint-disable @typescript-eslint/no-floating-promises -- describe/it de node:test devuelven promesas que el runner espera */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buscarEquivalente,
  MAX_OBJETIVOS,
  reconciliarConFavoritos,
  normalizarObjetivo,
  renombrarClave,
  renombrarEnLista,
  validarEdicionObjetivo,
  validarNuevoObjetivo,
} from './objetivos.ts'

const lista = (n: number) =>
  Array.from({ length: n }, (_, i) => `Objetivo ${i}`)

describe('validarNuevoObjetivo', () => {
  it('permite pasar de 9 a 10 objetivos y rechaza el 11', () => {
    assert.equal(MAX_OBJETIVOS, 10)
    assert.deepEqual(validarNuevoObjetivo('Nuevo', lista(9)), {
      ok: true,
      valor: 'Nuevo',
    })
    assert.deepEqual(validarNuevoObjetivo('Nuevo', lista(10)), {
      ok: false,
      error: 'limite',
    })
  })

  it('normaliza espacios y rechaza vacíos', () => {
    assert.equal(normalizarObjetivo('  Leer   cap 3 '), 'Leer cap 3')
    assert.deepEqual(validarNuevoObjetivo('   ', []), {
      ok: false,
      error: 'vacio',
    })
  })

  it('rechaza duplicados con distinto espaciado o mayúsculas', () => {
    assert.deepEqual(validarNuevoObjetivo('  leer  cap 3', ['Leer cap 3']), {
      ok: false,
      error: 'duplicado',
    })
  })

  it('aplica las mismas reglas a un favorito elegido', () => {
    const favorito = 'Repasar parcial'
    assert.equal(validarNuevoObjetivo(favorito, [favorito]).ok, false)
    assert.equal(validarNuevoObjetivo(favorito, lista(10)).ok, false)
  })
})

describe('validarEdicionObjetivo', () => {
  it('permite guardar el mismo texto en su propia posición', () => {
    assert.deepEqual(validarEdicionObjetivo(' A ', ['A', 'B'], 0), {
      ok: true,
      valor: 'A',
    })
  })

  it('rechaza renombrar a un texto que ya usa otro objetivo', () => {
    assert.deepEqual(validarEdicionObjetivo('b ', ['A', 'B'], 0), {
      ok: false,
      error: 'duplicado',
    })
  })

  it('no aplica el límite al editar con 10 objetivos', () => {
    assert.equal(validarEdicionObjetivo('Otro', lista(10), 3).ok, true)
  })

  it('rechaza dejarlo vacío', () => {
    assert.deepEqual(validarEdicionObjetivo('  ', ['A'], 0), {
      ok: false,
      error: 'vacio',
    })
  })
})

describe('renombrar estados relacionados', () => {
  it('mueve el tiempo acumulado a la nueva clave', () => {
    assert.deepEqual(renombrarClave({ A: 5, B: 2 }, 'A', 'C'), { B: 2, C: 5 })
  })

  it('no cambia el registro si la clave no existe', () => {
    const registro = { B: 2 }
    assert.equal(renombrarClave(registro, 'A', 'C'), registro)
  })

  it('renombra dentro de la lista de pendientes', () => {
    assert.deepEqual(renombrarEnLista(['A', 'B'], 'A', 'C'), ['C', 'B'])
  })
})

describe('buscarEquivalente', () => {
  it('encuentra el texto exacto de un favorito histórico con otros espacios', () => {
    const favoritos = ['  Leer   capítulo 1 ', 'Otro']
    assert.equal(buscarEquivalente('leer capítulo 1', favoritos), favoritos[0])
    assert.equal(buscarEquivalente('Nada', favoritos), undefined)
  })
})

describe('reconciliarConFavoritos', () => {
  it('propone renombrar objetivos escritos antes de cargar un favorito equivalente', () => {
    assert.deepEqual(
      reconciliarConFavoritos(
        ['Leer capítulo 1', 'Otro', 'Exacto'],
        ['  Leer   capítulo 1 ', 'Exacto']
      ),
      [['Leer capítulo 1', '  Leer   capítulo 1 ']]
    )
  })

  it('no renombra si el texto del favorito ya está en la lista', () => {
    assert.deepEqual(reconciliarConFavoritos(['leer', 'Leer'], ['Leer']), [])
  })
})
