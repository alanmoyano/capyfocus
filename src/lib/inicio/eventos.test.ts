// Ejecutar con: node --test 'src/lib/inicio/*.test.ts'
/* eslint-disable @typescript-eslint/no-floating-promises -- describe/it de node:test devuelven promesas que el runner espera */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  agregarEventos,
  crearEventoTemporal,
  esEventoTemporal,
  eventoDesdeRemoto,
  fechaLimiteDesdeFecha,
  validarEvento,
} from './eventos.ts'

const hoy = new Date(2026, 9, 14, 15, 30)

describe('validarEvento', () => {
  it('acepta hoy y normaliza el título', () => {
    const resultado = validarEvento(
      '  Parcial   Física ',
      new Date(2026, 9, 14),
      [],
      hoy
    )
    assert.ok(resultado.ok)
    assert.equal(resultado.titulo, 'Parcial Física')
  })

  it('rechaza título vacío, sin fecha o fecha pasada', () => {
    assert.deepEqual(validarEvento('   ', hoy, [], hoy), {
      ok: false,
      error: 'sinTitulo',
    })
    assert.deepEqual(validarEvento('A', undefined, [], hoy), {
      ok: false,
      error: 'sinFecha',
    })
    assert.deepEqual(validarEvento('A', new Date(2026, 9, 13), [], hoy), {
      ok: false,
      error: 'fechaPasada',
    })
  })

  it('rechaza el mismo nombre el mismo día', () => {
    const eventos = [{ id: 1, date: new Date(2026, 9, 20), title: 'Final' }]
    assert.deepEqual(
      validarEvento(' final ', new Date(2026, 9, 20, 10), eventos, hoy),
      {
        ok: false,
        error: 'duplicado',
      }
    )
    assert.equal(
      validarEvento('Final', new Date(2026, 9, 21), eventos, hoy).ok,
      true
    )
  })
})

describe('eventos remotos y temporales', () => {
  it('interpreta fechaLimite en hora local', () => {
    const evento = eventoDesdeRemoto({
      idEvento: 5,
      nombre: 'Final',
      fechaLimite: '2026-10-20',
      horasAcumuladas: null,
    })
    assert.equal(evento.id, 5)
    assert.equal(evento.date.getDate(), 20)
    assert.equal(evento.date.getMonth(), 9)
    assert.equal(evento.hoursAcumulated, undefined)
  })

  it('envía fechaLimite con el día local aunque sea de noche', () => {
    assert.equal(
      fechaLimiteDesdeFecha(new Date(2026, 9, 14, 23, 59)),
      '2026-10-14'
    )
    assert.equal(fechaLimiteDesdeFecha(new Date(2026, 0, 5)), '2026-01-05')
  })

  it('no duplica eventos por id al recuperar tarde', () => {
    const existente = { id: 5, date: hoy, title: 'A' }
    const resultado = agregarEventos(
      [existente],
      [
        { id: 5, date: hoy, title: 'A' },
        { id: 6, date: hoy, title: 'B' },
      ]
    )
    assert.deepEqual(
      resultado.map(e => e.id),
      [5, 6]
    )
    assert.equal(resultado[0], existente)
  })

  it('el evento de invitado es temporal con id negativo único', () => {
    const a = crearEventoTemporal('A', hoy)
    const b = crearEventoTemporal('B', hoy)
    assert.ok(a.id < 0 && b.id < 0)
    assert.notEqual(a.id, b.id)
    assert.equal(esEventoTemporal(a), true)
    assert.equal(esEventoTemporal({ id: 3 }), false)
  })
})
