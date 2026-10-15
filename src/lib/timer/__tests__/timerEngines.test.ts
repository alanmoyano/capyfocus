// node:test registra los casos con promesas que el runner ya espera
/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  applyCapydoroCommand,
  capydoroSnapshot,
  createCapydoroState,
  isCapydoroRunning,
  tickCapydoro,
  type CapydoroCommand,
  type CapydoroSnapshot,
  type CapydoroState,
} from '../capydoroEngine.ts'
import {
  applyCapymetroCommand,
  capymetroSnapshot,
  createCapymetroState,
  isCapymetroRunning,
  type CapymetroCommand,
  type CapymetroSnapshot,
} from '../capymetroEngine.ts'
import { ajustarSegundos } from '../ajusteMinutos.ts'
import { createWorkerHost } from '../workerHost.ts'

const MIN = 60 * 1000

// Reloj y scheduler controlados: los intervals solo corren al avanzar el reloj
function createFakeTime(start = 1_000_000) {
  let now = start
  let nextId = 1
  const intervals = new Map<
    number,
    { callback: () => void; ms: number; next: number }
  >()

  return {
    now: () => now,
    active: () => intervals.size,
    scheduler: {
      setInterval: (callback: () => void, ms: number) => {
        const id = nextId++
        intervals.set(id, { callback, ms, next: now + ms })
        return id
      },
      clearInterval: (id: unknown) => {
        intervals.delete(id as number)
      },
    },
    advance(ms: number) {
      const target = now + ms
      for (;;) {
        let due: { id: number; next: number } | null = null
        for (const [id, interval] of intervals) {
          if (interval.next <= target && (!due || interval.next < due.next)) {
            due = { id, next: interval.next }
          }
        }
        if (!due) break
        now = due.next
        const interval = intervals.get(due.id)
        if (!interval) continue
        interval.next += interval.ms
        interval.callback()
      }
      now = target
    },
  }
}

function capymetroHost() {
  const time = createFakeTime()
  const posted: CapymetroSnapshot[] = []
  const host = createWorkerHost({
    initialState: createCapymetroState(),
    apply: (state, command: CapymetroCommand, now) =>
      applyCapymetroCommand(state, command, now),
    snapshot: capymetroSnapshot,
    isRunning: isCapymetroRunning,
    now: time.now,
    scheduler: time.scheduler,
    post: message => posted.push(message),
    intervalMs: 1000,
  })
  return { time, host, last: () => posted[posted.length - 1] }
}

function capydoroHost() {
  const time = createFakeTime()
  const posted: CapydoroSnapshot[] = []
  const host = createWorkerHost({
    initialState: createCapydoroState(),
    apply: (state, command: CapydoroCommand, now) =>
      applyCapydoroCommand(state, command, now),
    tick: tickCapydoro,
    snapshot: capydoroSnapshot,
    isRunning: isCapydoroRunning,
    now: time.now,
    scheduler: time.scheduler,
    post: message => posted.push(message),
    intervalMs: 250,
  })
  return { time, host, last: () => posted[posted.length - 1] }
}

describe('CapyMetro', () => {
  it('un start repetido deja un solo interval y avanza un segundo por segundo', () => {
    const { time, host, last } = capymetroHost()
    host.handle('startTimer1')
    host.handle('startTimer1')
    assert.equal(time.active(), 1)

    time.advance(1000)
    assert.equal(last().timer1, 1)
    time.advance(9000)
    assert.equal(last().timer1, 10)
  })

  it('separa estudio y descanso y finalize limpia el interval', () => {
    const { time, host, last } = capymetroHost()
    host.handle('startTimer1')
    time.advance(5000)
    host.handle('pauseTimer1')
    host.handle('pauseTimer1')
    time.advance(3000)
    host.handle('startTimer1')
    time.advance(2000)
    host.handle('finalize')

    assert.equal(time.active(), 0)
    assert.deepEqual(last(), { timer1: 7, timer2: 3, phase: 'stopped' })

    time.advance(10_000)
    assert.equal(last().timer1, 7)
  })

  it('reset vuelve a cero y no deja intervals', () => {
    const { time, host, last } = capymetroHost()
    host.handle('startTimer1')
    time.advance(4000)
    host.handle('reset')
    assert.equal(time.active(), 0)
    assert.deepEqual(last(), { timer1: 0, timer2: 0, phase: 'idle' })
  })

  it('calcula desde timestamps aunque los ticks lleguen tarde', () => {
    let state = applyCapymetroCommand(createCapymetroState(), 'startTimer1', 0)
    state = applyCapymetroCommand(state, 'pauseTimer1', 90_500)
    assert.deepEqual(capymetroSnapshot(state, 100_000), {
      timer1: 90,
      timer2: 9,
      phase: 'break',
    })
  })
})

describe('Capydoro', () => {
  const start = (
    studyMinutes: number,
    breakMinutes: number
  ): CapydoroCommand => ({
    action: 'start',
    studyTime: studyMinutes * 60,
    breakTime: breakMinutes * 60,
  })

  function run(commands: [number, CapydoroCommand][]): CapydoroState {
    return commands.reduce(
      (state, [at, command]) => applyCapydoroCommand(state, command, at),
      createCapydoroState()
    )
  }

  it('un start repetido no reinicia la fase ni duplica intervals', () => {
    const { time, host, last } = capydoroHost()
    host.handle(start(25, 5))
    time.advance(MIN)
    host.handle(start(25, 5))
    assert.equal(time.active(), 1)
    time.advance(MIN)
    assert.equal(last().studySeconds, 120)
    assert.equal(last().timeLeft, 23 * 60)
  })

  it('pausa y reanudación no cuentan el tiempo en pausa', () => {
    const { time, host, last } = capydoroHost()
    host.handle(start(25, 5))
    time.advance(2 * MIN)
    host.handle({ action: 'pause' })
    host.handle({ action: 'pause' })
    assert.equal(time.active(), 0)
    time.advance(10 * MIN)
    host.handle({ action: 'resume' })
    host.handle({ action: 'resume' })
    assert.equal(time.active(), 1)
    time.advance(MIN)
    assert.equal(last().studySeconds, 180)
    assert.equal(last().timeLeft, 22 * 60)
  })

  it('saltar el estudio a los 5 de 25 minutos registra 5 minutos efectivos', () => {
    const state = run([
      [0, start(25, 5)],
      [5 * MIN, { action: 'skip' }],
    ])
    const snapshot = capydoroSnapshot(state, 6 * MIN)
    assert.equal(snapshot.phase, 'break')
    assert.equal(snapshot.running, false)
    assert.equal(snapshot.studySeconds, 5 * 60)
    assert.equal(snapshot.timeLeft, 5 * 60)
    assert.equal(snapshot.completedStudies, 1)
  })

  it('finalizar durante el descanso tras un salto persiste solo el estudio efectivo', () => {
    const state = run([
      [0, start(25, 5)],
      [5 * MIN, { action: 'skip' }],
      [6 * MIN, { action: 'resume' }],
      [8 * MIN, { action: 'finalize' }],
    ])
    const snapshot = capydoroSnapshot(state, 30 * MIN)
    assert.equal(snapshot.phase, 'finished')
    assert.equal(snapshot.studySeconds, 5 * 60)
    assert.equal(snapshot.breakSeconds, 2 * 60)
  })

  it('saltar el descanso cierra el ciclo y vuelve a la configuración', () => {
    const state = run([
      [0, start(25, 5)],
      [24 * MIN, { action: 'skip' }],
      [26 * MIN, { action: 'resume' }],
      [27 * MIN, { action: 'skip' }],
    ])
    const snapshot = capydoroSnapshot(state, 28 * MIN)
    assert.equal(snapshot.phase, 'setup')
    assert.equal(snapshot.completedBreaks, 1)
    assert.equal(snapshot.studySeconds, 24 * 60)
    assert.equal(snapshot.breakSeconds, 60)
  })

  it('un doble clic en saltar solo salta la fase visible', () => {
    let state = applyCapydoroCommand(createCapydoroState(), start(25, 5), 0)
    const visible = state.segmentId
    state = applyCapydoroCommand(
      state,
      { action: 'skip', segmentId: visible },
      5 * MIN
    )
    state = applyCapydoroCommand(
      state,
      { action: 'skip', segmentId: visible },
      5 * MIN
    )
    const snapshot = capydoroSnapshot(state, 5 * MIN)
    assert.equal(snapshot.phase, 'break')
    assert.equal(snapshot.completedBreaks, 0)
  })

  it('un salto que llega después del fin natural no saltea el descanso', () => {
    const state = run([
      [0, start(25, 5)],
      [25 * MIN + 100, { action: 'skip' }],
    ])
    const snapshot = capydoroSnapshot(state, 26 * MIN)
    assert.equal(snapshot.phase, 'break')
    assert.equal(snapshot.timeLeft, 5 * 60)
    assert.equal(snapshot.studySeconds, 25 * 60)
  })

  it('el fin natural no suma tiempo extra aunque el tick llegue tarde', () => {
    let state = applyCapydoroCommand(createCapydoroState(), start(25, 5), 0)
    state = tickCapydoro(state, 40 * MIN)
    const snapshot = capydoroSnapshot(state, 40 * MIN)
    assert.equal(snapshot.phase, 'break')
    assert.equal(snapshot.running, false)
    assert.equal(snapshot.studySeconds, 25 * 60)
    assert.equal(snapshot.breakSeconds, 0)
  })

  it('el host detiene el interval al terminar el estudio y espera al usuario', () => {
    const { time, host, last } = capydoroHost()
    host.handle(start(1, 1))
    time.advance(61_000)
    assert.equal(time.active(), 0)
    assert.equal(last().phase, 'break')
    assert.equal(last().studySeconds, 60)

    host.handle({ action: 'startBr' })
    time.advance(61_000)
    assert.equal(last().phase, 'setup')
    assert.equal(last().breakSeconds, 60)
    assert.equal(last().completedBreaks, 1)
    assert.equal(time.active(), 0)
  })

  it('un ciclo nuevo acumula sobre los anteriores y finalize ignora comandos posteriores', () => {
    const state = run([
      [0, start(25, 5)],
      [10 * MIN, { action: 'skip' }],
      [10 * MIN, { action: 'resume' }],
      [15 * MIN, { action: 'skip' }],
      [16 * MIN, start(30, 5)],
      [20 * MIN, { action: 'finalize' }],
      [21 * MIN, { action: 'resume' }],
      [22 * MIN, start(30, 5)],
    ])
    const snapshot = capydoroSnapshot(state, 40 * MIN)
    assert.equal(snapshot.phase, 'finished')
    assert.equal(snapshot.running, false)
    assert.equal(snapshot.studySeconds, 14 * 60)
    assert.equal(snapshot.breakSeconds, 5 * 60)
  })
})

describe('ajuste de minutos', () => {
  it('respeta el mínimo de un minuto y el máximo', () => {
    assert.equal(ajustarSegundos(120, -60), 60)
    assert.equal(ajustarSegundos(60, -60), 60)
    assert.equal(ajustarSegundos(180 * 60, 60), 180 * 60)
    assert.equal(ajustarSegundos(25 * 60, 60), 26 * 60)
  })
})
