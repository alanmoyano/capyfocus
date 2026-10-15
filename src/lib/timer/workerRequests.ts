// Asocia comandos enviados al worker con su respuesta, para poder esperar el
// estado exacto en el que quedó el motor (por ejemplo, al finalizar la sesión).
// Si el worker no existe o no responde a tiempo, la promesa se rechaza: un valor
// sin confirmar no debe usarse para persistir datos.

type Pending<T> = {
  resolve: (value: T) => void
  reject: (error: Error) => void
  timeoutId: ReturnType<typeof setTimeout>
}

export class WorkerRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WorkerRequestError'
  }
}

export function createWorkerRequests<T>(timeoutMs = 5000) {
  let nextId = 1
  const pending = new Map<number, Pending<T>>()

  return {
    // `send` devuelve false si no pudo enviar el comando
    request(send: (requestId: number) => boolean) {
      const requestId = nextId++
      return new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          pending.delete(requestId)
          reject(
            new WorkerRequestError('El temporizador no respondió a tiempo')
          )
        }, timeoutMs)
        pending.set(requestId, { resolve, reject, timeoutId })
        if (!send(requestId)) {
          clearTimeout(timeoutId)
          pending.delete(requestId)
          reject(new WorkerRequestError('El temporizador no está disponible'))
        }
      })
    },
    settle(requestId: number | undefined, value: T) {
      if (requestId === undefined) return
      const entry = pending.get(requestId)
      if (!entry) return
      clearTimeout(entry.timeoutId)
      pending.delete(requestId)
      entry.resolve(value)
    },
  }
}
