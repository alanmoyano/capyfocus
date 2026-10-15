// Asocia comandos enviados al worker con su respuesta, para poder esperar el
// estado exacto en el que quedó el motor (por ejemplo, al finalizar la sesión).

type Pending<T> = {
  resolve: (value: T) => void
  timeoutId: ReturnType<typeof setTimeout>
}

export function createWorkerRequests<T>(timeoutMs = 2000) {
  let nextId = 1
  const pending = new Map<number, Pending<T>>()

  return {
    // `fallback` se usa si el worker no responde a tiempo o no existe
    request(send: (requestId: number) => boolean, fallback: () => T) {
      const requestId = nextId++
      return new Promise<T>(resolve => {
        const timeoutId = setTimeout(() => {
          pending.delete(requestId)
          resolve(fallback())
        }, timeoutMs)
        pending.set(requestId, { resolve, timeoutId })
        if (!send(requestId)) {
          clearTimeout(timeoutId)
          pending.delete(requestId)
          resolve(fallback())
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
