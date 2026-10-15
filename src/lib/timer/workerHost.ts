// Adaptador entre un motor puro y el entorno de un Web Worker.
// Garantiza un único interval activo: se crea al pasar a un estado que corre y se
// limpia al dejar de correr, sin importar cuántas veces llegue el mismo comando.

export type Scheduler = {
  setInterval: (callback: () => void, ms: number) => unknown
  clearInterval: (id: unknown) => void
}

type HostOptions<State, Command, Snapshot> = {
  initialState: State
  apply: (state: State, command: Command, now: number) => State
  tick?: (state: State, now: number) => State
  snapshot: (state: State, now: number) => Snapshot
  isRunning: (state: State) => boolean
  now: () => number
  scheduler: Scheduler
  // requestId solo viaja en la respuesta al comando que lo envió
  post: (message: Snapshot | (Snapshot & { requestId: number })) => void
  intervalMs?: number
}

export function createWorkerHost<State, Command, Snapshot>({
  initialState,
  apply,
  tick,
  snapshot,
  isRunning,
  now,
  scheduler,
  post,
  intervalMs = 250,
}: HostOptions<State, Command, Snapshot>) {
  let state = initialState
  let intervalId: unknown = null
  let lastPosted = ''

  function publish(force: boolean, requestId?: number) {
    const current = snapshot(state, now())
    const serialized = JSON.stringify(current)
    if (!force && serialized === lastPosted) return
    lastPosted = serialized
    post(requestId === undefined ? current : { ...current, requestId })
  }

  function syncInterval() {
    if (isRunning(state)) {
      if (intervalId !== null) return
      intervalId = scheduler.setInterval(onTick, intervalMs)
    } else if (intervalId !== null) {
      scheduler.clearInterval(intervalId)
      intervalId = null
    }
  }

  function onTick() {
    if (tick) state = tick(state, now())
    syncInterval()
    publish(false)
  }

  return {
    handle(command: Command, requestId?: number) {
      state = apply(state, command, now())
      syncInterval()
      publish(true, requestId)
    },
    dispose() {
      if (intervalId !== null) scheduler.clearInterval(intervalId)
      intervalId = null
    },
    getState: () => state,
  }
}
