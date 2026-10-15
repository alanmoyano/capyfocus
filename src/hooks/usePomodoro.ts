import { useEffect, useRef, useState } from 'react'
import {
  capydoroSnapshot,
  createCapydoroState,
  type CapydoroCommand,
  type CapydoroSnapshot,
} from '@/lib/timer/capydoroEngine'
import { createWorkerRequests } from '@/lib/timer/workerRequests'

const initialSnapshot: CapydoroSnapshot = {
  ...capydoroSnapshot(createCapydoroState(), 0),
  timeLeft: -1,
}

export default function usePomodoro() {
  const [snapshot, setSnapshot] = useState<CapydoroSnapshot>(initialSnapshot)

  const workerRef = useRef<Worker | null>()
  const snapshotRef = useRef(initialSnapshot)
  const requestsRef = useRef(createWorkerRequests<CapydoroSnapshot>())

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/capydoro.ts', import.meta.url),
      { type: 'module' }
    )
    workerRef.current = worker

    worker.onmessage = (
      event: MessageEvent<CapydoroSnapshot & { requestId?: number }>
    ) => {
      const { requestId, ...next } = event.data
      snapshotRef.current = next
      setSnapshot(next)
      requestsRef.current.settle(requestId, next)
    }

    return () => {
      // Limpiar el worker al desmontar el componente
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  function send(command: CapydoroCommand) {
    workerRef.current?.postMessage(command)
  }

  function startStudy({
    studyTime,
    breakTime,
  }: {
    studyTime: number
    breakTime: number
  }) {
    send({ action: 'start', studyTime, breakTime })
  }

  function pauseStudy() {
    send({ action: 'pause' })
  }

  function resumeStudy() {
    send({ action: 'resume' })
  }

  function stopStudy() {
    send({ action: 'stop' })
  }

  function startBreak() {
    send({ action: 'startBr' })
  }

  // El parámetro se conserva por compatibilidad: el motor ya conoce el descanso planificado
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function skipCurrent(_breakTime?: number) {
    send({ action: 'skip', segmentId: snapshotRef.current.segmentId })
  }

  // Termina la sesión y resuelve con los acumulados confirmados por el worker.
  // Rechaza si el worker no responde; se puede volver a llamar sin efectos extra.
  function finalize() {
    return requestsRef.current.request(requestId => {
      if (!workerRef.current) return false
      workerRef.current.postMessage({ action: 'finalize', requestId })
      return true
    })
  }

  return {
    // API original
    time: snapshot.timeLeft,
    isStudying: snapshot.phase === 'study' && snapshot.running,
    isPaused: !snapshot.running,
    startStudy,
    pauseStudy,
    resumeStudy,
    stopStudy,
    startBreak,
    skipCurrent,
    // Estado derivado del motor
    phase: snapshot.phase,
    isRunning: snapshot.running,
    studySeconds: snapshot.studySeconds,
    breakSeconds: snapshot.breakSeconds,
    completedStudies: snapshot.completedStudies,
    completedBreaks: snapshot.completedBreaks,
    segmentId: snapshot.segmentId,
    finalize,
  }
}
