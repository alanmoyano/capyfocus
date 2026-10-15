// node:test registra los casos con promesas que el runner ya espera
/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'
import { createWorkerRequests, WorkerRequestError } from '../workerRequests.ts'

describe('pedidos al worker', () => {
  beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }))
  afterEach(() => mock.timers.reset())

  it('resuelve con la respuesta confirmada del worker', async () => {
    const requests = createWorkerRequests<number>(1000)
    let sentId = 0
    const pending = requests.request(id => {
      sentId = id
      return true
    })
    requests.settle(sentId, 700)
    assert.equal(await pending, 700)
  })

  it('rechaza si no hay respuesta a tiempo e ignora la respuesta tardía', async () => {
    const requests = createWorkerRequests<number>(1000)
    let sentId = 0
    const pending = requests.request(id => {
      sentId = id
      return true
    })
    mock.timers.tick(1000)
    await assert.rejects(pending, WorkerRequestError)

    // La respuesta tardía no resuelve nada; un nuevo pedido sí obtiene el valor
    requests.settle(sentId, 600)
    const retry = requests.request(id => {
      sentId = id
      return true
    })
    requests.settle(sentId, 700)
    assert.equal(await retry, 700)
  })

  it('rechaza si el worker no existe', async () => {
    const requests = createWorkerRequests<number>(1000)
    await assert.rejects(
      requests.request(() => false),
      WorkerRequestError
    )
  })
})
