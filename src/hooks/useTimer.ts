import { useEffect, useRef, useState } from 'react'
import type {
  CapymetroCommand,
  CapymetroSnapshot,
} from '@/lib/timer/capymetroEngine'
import { createWorkerRequests } from '@/lib/timer/workerRequests'

export type TimerTotals = { studyTime: number; breakTime: number }

export default function useTimer() {
  const [studyTime, setStudyTime] = useState(0)
  const [breakTime, setBreakTime] = useState(0)
  const [isStudying, setIsStudying] = useState(true)

  const workerRef = useRef<Worker | null>()
  const requestsRef = useRef(createWorkerRequests<TimerTotals>())

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/capymetro.ts', import.meta.url),
      { type: 'module' }
    )
    workerRef.current = worker

    worker.onmessage = (
      event: MessageEvent<CapymetroSnapshot & { requestId?: number }>
    ) => {
      const { timer1, timer2, requestId } = event.data
      setStudyTime(timer1)
      setBreakTime(timer2)
      requestsRef.current.settle(requestId, {
        studyTime: timer1,
        breakTime: timer2,
      })
    }

    return () => {
      // Limpiar el worker al desmontar el componente
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  function send(command: CapymetroCommand) {
    workerRef.current?.postMessage(command)
  }

  function startStudy() {
    send('startTimer1')

    setIsStudying(true)
  }

  function pauseStudy() {
    send('pauseTimer1')

    setIsStudying(false)
  }

  function resetTimers() {
    send('reset')

    setStudyTime(0)
    setBreakTime(0)
    setIsStudying(false)
  }

  // Detiene ambos contadores y resuelve con los totales confirmados por el worker.
  // Rechaza si el worker no responde; se puede volver a llamar sin efectos extra.
  function finalizeTimers() {
    return requestsRef.current.request(requestId => {
      if (!workerRef.current) return false
      workerRef.current.postMessage({ command: 'finalize', requestId })
      return true
    })
  }

  return {
    studyTime,
    breakTime,
    isStudying,
    startStudy,
    pauseStudy,
    resetTimers,
    finalizeTimers,
  }
}
