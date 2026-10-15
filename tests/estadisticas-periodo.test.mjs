import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  agruparDias,
  fechaLocal,
  mayorRacha,
  parsearFechaLocal,
  rangoPeriodo,
  resumirPeriodo,
} from '../src/components/ComponentesEspecifico/estadisticasPeriodoDatos.ts'

const sesion = (fecha, valores = {}) => ({
  fecha,
  tecnicaEstudio: 1,
  tipoMotivacion: 1,
  musicaSeleccionada: 0,
  cantidadObjetivos: 3,
  cantidadObjetivosCumplidos: 1,
  tiempoEstudio: 60,
  ...valores,
})
const limites = (periodo, hoy) => {
  const rango = rangoPeriodo(periodo, parsearFechaLocal(hoy))
  return [fechaLocal(rango.desde), fechaLocal(rango.hasta)]
}

test('semana incluye hoy y seis días anteriores, con cambio de año', () => {
  assert.deepEqual(limites('semanal', '2025-01-03'), [
    '2024-12-28',
    '2025-01-03',
  ])
  const resumen = resumirPeriodo(
    ['2024-12-27', '2024-12-28', '2025-01-03', '2025-01-04'].map(fecha =>
      sesion(fecha)
    ),
    rangoPeriodo('semanal', parsearFechaLocal('2025-01-03')),
    'semanal'
  )
  assert.equal(resumen.cantidadSesiones, 2)
  assert.equal(resumen.chartData.length, 7)
  assert.equal(resumen.objetivosTotales, 6)
  assert.deepEqual(resumen.fechasOrdenadas, ['2024-12-28', '2025-01-03'])
})

for (const [periodo, hoy, desde, dias] of [
  ['mensual', '2024-02-29', '2024-02-01', 29],
  ['mensual', '2025-02-28', '2025-02-01', 28],
  ['mensual', '2025-03-31', '2025-03-01', 31],
  ['bimestral', '2025-03-31', '2025-02-01', 59],
  ['bimestral', '2025-01-31', '2024-12-01', 62],
  ['semestre', '2025-01-31', '2024-08-01', 184],
  ['semestre', '2024-06-30', '2024-01-01', 182],
]) {
  test(`${periodo} al ${hoy} usa meses calendario sin overflow`, () => {
    assert.deepEqual(limites(periodo, hoy), [desde, hoy])
    const resumen = resumirPeriodo(
      [],
      rangoPeriodo(periodo, parsearFechaLocal(hoy)),
      periodo
    )
    assert.equal(resumen.sessionInfoAcumuladas.length, dias)
    assert.equal(fechaLocal(resumen.chartData[0].date), desde)
  })
}

for (const cantidad of [0, 1, 7, 8, 14, 15, 16]) {
  for (const tamaño of [2, 7]) {
    test(`agregación de ${cantidad} días en buckets de ${tamaño} conserva remanentes`, () => {
      const dias = Array.from({ length: cantidad }, (_, i) => ({
        fecha: fechaLocal(new Date(2024, 1, i + 1)),
        objetivosTotales: 3,
        objetivosCumplidos: 1,
        tiempoEstudio: 0,
        cantidadSesiones: 1,
      }))
      const buckets = agruparDias(dias, tamaño)
      assert.equal(buckets.length, Math.ceil(cantidad / tamaño))
      assert.equal(
        buckets.reduce((suma, bucket) => suma + bucket.cumplidos, 0),
        cantidad
      )
      assert.equal(
        buckets.reduce((suma, bucket) => suma + bucket.pendientes, 0),
        cantidad * 2
      )
    })
  }
}

test('varias sesiones por día, días vacíos y totales coinciden con el gráfico', () => {
  const resumen = resumirPeriodo(
    [sesion('2024-02-02'), sesion('2024-02-02'), sesion('2024-02-29')],
    rangoPeriodo('semestre', parsearFechaLocal('2024-02-29')),
    'semestre'
  )
  assert.equal(resumen.objetivosTotales, 9)
  assert.equal(resumen.tiempoEstudio, 180)
  assert.equal(
    resumen.sessionInfoAcumuladas.find(dia => dia.fecha === '2024-02-02')
      .cantidadSesiones,
    2
  )
  assert.equal(
    resumen.sessionInfoAcumuladas.find(dia => dia.fecha === '2024-02-03')
      .cantidadSesiones,
    0
  )
  assert.equal(
    resumen.chartData.reduce(
      (sum, bucket) => sum + bucket.cumplidos + bucket.pendientes,
      0
    ),
    resumen.objetivosTotales
  )
})

test('sin datos no inventa favoritos; sesiones con cero siguen siendo datos', () => {
  const rango = rangoPeriodo('semanal', parsearFechaLocal('2025-03-10'))
  const vacio = resumirPeriodo([], rango, 'semanal')
  assert.equal(vacio.cantidadSesiones, 0)
  assert.equal(vacio.musicaFavorita, 'Sin datos')
  assert.equal(vacio.tecnicaEstudio, 'Sin datos')
  assert.equal(vacio.motivacion, 'Sin datos')
  assert.equal(vacio.racha, 0)
  const cero = resumirPeriodo(
    [
      sesion('2025-03-10', {
        cantidadObjetivos: 0,
        cantidadObjetivosCumplidos: 0,
        tiempoEstudio: 0,
      }),
    ],
    rango,
    'semanal'
  )
  assert.equal(cero.cantidadSesiones, 1)
  assert.equal(cero.objetivosTotales, 0)
  assert.equal(cero.musicaFavorita, 'Sin música')
  assert.equal(cero.tecnicaEstudio, 'CapyDoro')
})

test('mayor racha cuenta días únicos y conserva el máximo, no el tramo final', () => {
  assert.equal(
    mayorRacha([
      '2025-01-05',
      '2024-12-31',
      '2025-01-01',
      '2025-01-01',
      '2024-12-30',
    ]),
    3
  )
  assert.equal(mayorRacha(['2024-02-28', '2024-02-29', '2024-03-01']), 3)
  assert.equal(mayorRacha(['2025-03-08', '2025-03-09', '2025-03-10']), 3)
  assert.equal(mayorRacha([]), 0)
})

test('YYYY-MM-DD se interpreta como fecha local incluso cerca de medianoche', () => {
  const fecha = parsearFechaLocal('2024-02-29')
  assert.equal(fecha.getDate(), 29)
  assert.equal(fecha.getMonth(), 1)
  assert.equal(fecha.getHours(), 0)
  assert.equal(fechaLocal(fecha), '2024-02-29')
})

test('valores numéricos serializados se acumulan como números', () => {
  const resumen = resumirPeriodo(
    [
      sesion('2024-02-02', {
        cantidadObjetivos: '3',
        cantidadObjetivosCumplidos: '1',
      }),
      sesion('2024-02-02'),
    ],
    rangoPeriodo('mensual', parsearFechaLocal('2024-02-29')),
    'mensual'
  )
  assert.equal(resumen.objetivosTotales, 6)
  assert.equal(resumen.objetivosCumplidos, 2)
})
