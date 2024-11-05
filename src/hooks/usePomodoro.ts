import { useEffect, useRef, useState } from 'react'

type props = {
  timeLeft: number
  isWorking: boolean
  isPaused: boolean
}

export default function usePomodoro() {
  const [time, setTime] = useState(-1)
  const [isStudying, setIsStudying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [breakTime, setBreakTime] = useState(0)

  const workerRef = useRef<Worker | null>()

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/capydoro.ts', import.meta.url)
    )

    workerRef.current.onmessage = event => {
      const { timeLeft, isWorking, isPaused } = event.data as props
      setTime(timeLeft)
      setIsStudying(isWorking)
      setIsPaused(isPaused)
    }

    return () => {
      // Limpiar el worker al desmontar el componente
      workerRef.current?.terminate()
    }
  }, [])

  function startStudy({
    studyTime,
    breakTime,
  }: {
    studyTime: number
    breakTime: number
  }) {
    setTime(studyTime)
    setBreakTime(breakTime)
    workerRef.current?.postMessage({ action: 'start', studyTime, breakTime })

    setIsStudying(true)
  }

  function pauseStudy() {
    workerRef.current?.postMessage({ action: 'pause' })

    setIsStudying(false)
  }

  function resumeStudy() {
    workerRef.current?.postMessage({ action: 'resume' })

    setIsStudying(true)
  }

  function stopStudy() {
    workerRef.current?.postMessage({ action: 'stop' })
    setTime(1)
    setIsStudying(false)
  }

  function startBreak() {
    workerRef.current?.postMessage({ action: 'startBr' })
    setIsStudying(true)
  }
  function skipCurrent(breakTime: number) {
    workerRef.current?.postMessage({
      action: 'skip',
      studyTime: -1,
      breakTime: breakTime,
    })
    setIsStudying(false)
  }

  return {
    time,
    isStudying,
    isPaused,
    startStudy,
    pauseStudy,
    resumeStudy,
    stopStudy,
    startBreak,
    skipCurrent,
  }
}
