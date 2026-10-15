import {
  applyCapydoroCommand,
  capydoroSnapshot,
  createCapydoroState,
  isCapydoroRunning,
  tickCapydoro,
  type CapydoroCommand,
} from '../lib/timer/capydoroEngine.ts'
import { createWorkerHost } from '../lib/timer/workerHost.ts'

const host = createWorkerHost({
  initialState: createCapydoroState(),
  apply: applyCapydoroCommand,
  tick: tickCapydoro,
  snapshot: capydoroSnapshot,
  isRunning: isCapydoroRunning,
  now: () => Date.now(),
  scheduler: {
    setInterval: (callback, ms) => setInterval(callback, ms),
    clearInterval: id => clearInterval(id as ReturnType<typeof setInterval>),
  },
  post: snapshot => postMessage(snapshot),
})

onmessage = function (
  e: MessageEvent<CapydoroCommand & { requestId?: number }>
) {
  const { requestId, ...command } = e.data
  host.handle(command, requestId)
}
