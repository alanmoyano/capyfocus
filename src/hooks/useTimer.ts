import { useEffect, useRef, useState } from 'react'

export default function useTimer() {
  const [studyTime, setStudyTime] = useState(0)
  const [breakTime, setBreakTime] = useState(0)
  const [isStudying, setIsStudying] = useState(true)

  const workerRef = useRef<Worker | null>()

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/capymetro.ts', import.meta.url)
    )

    workerRef.current.onmessage = event => {
      const { timer1, timer2 } = event.data as Record<string, number>
      setStudyTime(timer1)
      setBreakTime(timer2)
    }

    return () => {
      // Limpiar el worker al desmontar el componente
      workerRef.current?.terminate()
    }
  }, [])

  function startStudy() {
    workerRef.current?.postMessage('startTimer1')

    setIsStudying(true)
  }

  function pauseStudy() {
    workerRef.current?.postMessage('pauseTimer1')

    setIsStudying(false)
  }

  function resetTimers() {
    workerRef.current?.postMessage('reset')

    setStudyTime(0)
    setBreakTime(0)
    setIsStudying(false)
  }

  function finalizeTimers() {
    workerRef.current?.postMessage('finalize')
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
