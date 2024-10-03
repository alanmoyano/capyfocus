import { useEffect, useRef, useState } from 'react'
import carpincho from '@/assets/Sonido_de_caripincho.mp3'
import useSound from 'use-sound'

export default function useTimer() {
  const [studyTime, setStudyTime] = useState(0)
  const [restTime, setRestTime] = useState(0)
  const [isStudying, setIsStudying] = useState(false)

  const [capySound] = useSound(carpincho)

  const workerRef = useRef<Worker | null>()

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/worker.ts', import.meta.url)
    )

    workerRef.current.onmessage = event => {
      const { timer1, timer2 } = event.data as Record<string, number>
      setStudyTime(timer1)
      setRestTime(timer2)
      if (timer1 >= 600 && isStudying) {
        pauseStudy()
        capySound()
        console.log('sonó el capy!')
      }
    }

    return () => {
      // Limpiar el worker al desmontar el componente
      if (!workerRef.current) return
      workerRef.current.terminate()
    }
  }, [])

  const startStudy = () => {
    if (!workerRef.current) return
    workerRef.current.postMessage('startTimer1')

    setIsStudying(true)
  }

  const pauseStudy = () => {
    if (!workerRef.current) return

    workerRef.current.postMessage('pauseTimer1')
    setIsStudying(false)
  }

  const resetTimers = () => {
    if (!workerRef.current) return

    workerRef.current.postMessage('reset')
    setStudyTime(0)
    setRestTime(0)
    setIsStudying(false)
  }

  return {
    studyTime,
    restTime,
    isStudying,
    startStudy,
    pauseStudy,
    resetTimers
  }
}
