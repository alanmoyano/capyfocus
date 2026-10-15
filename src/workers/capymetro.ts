import {
  applyCapymetroCommand,
  capymetroSnapshot,
  createCapymetroState,
  isCapymetroRunning,
  type CapymetroCommand,
} from '../lib/timer/capymetroEngine.ts'
import { createWorkerHost } from '../lib/timer/workerHost.ts'

type Message =
  CapymetroCommand | { command: CapymetroCommand; requestId: number }

const host = createWorkerHost({
  initialState: createCapymetroState(),
  apply: applyCapymetroCommand,
  snapshot: capymetroSnapshot,
  isRunning: isCapymetroRunning,
  now: () => Date.now(),
  scheduler: {
    setInterval: (callback, ms) => setInterval(callback, ms),
    clearInterval: id => clearInterval(id as ReturnType<typeof setInterval>),
  },
  post: snapshot => postMessage(snapshot),
})

onmessage = function (e: MessageEvent<Message>) {
  if (typeof e.data === 'string') host.handle(e.data)
  else host.handle(e.data.command, e.data.requestId)
}
