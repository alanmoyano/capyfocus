// node:test registra los casos con promesas que el runner ya espera
/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'

// Carga el archivo real del worker en un global simulado y cuenta los intervals vivos
type WorkerGlobal = {
  onmessage: ((event: { data: unknown }) => void) | null
  postMessage: (message: unknown) => void
}

async function loadWorker(path: string) {
  const scope = globalThis as unknown as WorkerGlobal
  const getHandler = () => scope.onmessage
  const posted: Record<string, unknown>[] = []
  scope.onmessage = null
  scope.postMessage = message => posted.push(message as Record<string, unknown>)

  let active = 0
  const realSetInterval = globalThis.setInterval
  const realClearInterval = globalThis.clearInterval
  globalThis.setInterval = ((callback: () => void, ms: number) => {
    active++
    return realSetInterval(callback, ms)
  }) as typeof setInterval
  globalThis.clearInterval = ((id: ReturnType<typeof setInterval>) => {
    active--
    realClearInterval(id)
  }) as typeof clearInterval

  await import(`${path}?t=${Date.now()}-${Math.random()}`)
  const onmessage = getHandler()
  assert.ok(onmessage)

  return {
    send: (data: unknown) => onmessage({ data }),
    last: () => posted[posted.length - 1],
    active: () => active,
    restore: () => {
      globalThis.setInterval = realSetInterval
      globalThis.clearInterval = realClearInterval
    },
  }
}

describe('workers reales con reloj simulado', () => {
  let restore: (() => void) | null = null

  beforeEach(() => {
    mock.timers.enable({ apis: ['setInterval', 'Date'], now: 0 })
  })

  afterEach(() => {
    restore?.()
    mock.timers.reset()
  })

  it('capymetro: dos start no duplican el avance y finalize no deja intervals', async () => {
    const worker = await loadWorker('../capymetro.ts')
    restore = worker.restore

    worker.send('startTimer1')
    worker.send('startTimer1')
    assert.equal(worker.active(), 1)

    mock.timers.tick(1000)
    assert.equal(worker.last().timer1, 1)

    worker.send({ command: 'finalize', requestId: 7 })
    assert.equal(worker.active(), 0)
    assert.deepEqual(worker.last(), {
      timer1: 1,
      timer2: 0,
      phase: 'stopped',
      requestId: 7,
    })
  })

  it('capydoro: dos start no duplican el avance y stop no deja intervals', async () => {
    const worker = await loadWorker('../capydoro.ts')
    restore = worker.restore

    const start = { action: 'start', studyTime: 25 * 60, breakTime: 5 * 60 }
    worker.send(start)
    worker.send(start)
    assert.equal(worker.active(), 1)

    mock.timers.tick(1000)
    assert.equal(worker.last().studySeconds, 1)
    assert.equal(worker.last().timeLeft, 25 * 60 - 1)

    worker.send({ action: 'stop' })
    assert.equal(worker.active(), 0)
  })
})
