import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  consultarSesionesPeriodo,
  iniciarConsultaPeriodo,
} from '../src/components/ComponentesEspecifico/estadisticasPeriodoConsulta.ts'
import {
  rangoPeriodo,
  parsearFechaLocal,
} from '../src/components/ComponentesEspecifico/estadisticasPeriodoDatos.ts'

function clienteMock(respuesta) {
  const llamadas = []
  const query = Object.fromEntries(
    ['from', 'select', 'eq', 'gte', 'lte'].map(metodo => [
      metodo,
      (...args) => {
        llamadas.push([metodo, ...args])
        return query
      },
    ])
  )
  query.then = (resolver, rechazar) =>
    Promise.resolve(respuesta).then(resolver, rechazar)
  return { cliente: query, llamadas }
}

const turno = () => new Promise(resolve => setImmediate(resolve))
const diferida = () => {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

test('consulta filtra identidad y ambos extremos inclusivos del mismo rango', async () => {
  const { cliente, llamadas } = clienteMock({ data: [], error: null })
  const rango = rangoPeriodo('semanal', parsearFechaLocal('2025-01-03'))
  assert.deepEqual(
    await consultarSesionesPeriodo(cliente, 'usuario-prueba', rango),
    []
  )
  assert.deepEqual(
    llamadas.filter(([metodo]) => ['eq', 'gte', 'lte'].includes(metodo)),
    [
      ['eq', 'idUsuario', 'usuario-prueba'],
      ['gte', 'fecha', '2024-12-28'],
      ['lte', 'fecha', '2025-01-03'],
    ]
  )
  assert.equal(llamadas[0][1], 'SesionesDeEstudio')
})

test('error de Supabase se propaga y no se convierte en ausencia de sesiones', async () => {
  const error = { message: 'fallo de consulta' }
  const { cliente } = clienteMock({ data: null, error })
  await assert.rejects(
    consultarSesionesPeriodo(
      cliente,
      'usuario-prueba',
      rangoPeriodo('mensual', parsearFechaLocal('2024-02-29'))
    ),
    valor => valor === error
  )
})

for (const resultado of ['success', 'error']) {
  test(`respuesta tardía ${resultado} del período/usuario anterior no publica estado`, async () => {
    const anterior = diferida()
    const actual = diferida()
    const publicados = []
    const cancelar = iniciarConsultaPeriodo(
      () => anterior.promise,
      data => publicados.push(data),
      () => publicados.push('error anterior')
    )
    cancelar()
    iniciarConsultaPeriodo(
      () => actual.promise,
      data => publicados.push(data),
      () => publicados.push('error actual')
    )
    actual.resolve('datos actuales')
    await turno()
    if (resultado === 'success') anterior.resolve('datos anteriores')
    else anterior.reject(new Error('error anterior'))
    await turno()
    assert.deepEqual(publicados, ['datos actuales'])
  })
}

test('error vigente publica error; una consulta nueva puede recuperarse con cero sesiones', async () => {
  const publicados = []
  iniciarConsultaPeriodo(
    () => Promise.reject(new Error('fallo')),
    data => publicados.push(data),
    () => publicados.push('error')
  )
  await turno()
  iniciarConsultaPeriodo(
    () => Promise.resolve([]),
    data => publicados.push(data),
    () => publicados.push('error')
  )
  await turno()
  assert.deepEqual(publicados, ['error', []])
})
