import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Helmet } from 'react-helmet'
import { formatTime } from '@/lib/utils'
import carpincho from '@/assets/Sonido_de_caripincho.mp3'
import useSound from 'use-sound'

export default function Prueba() {
  const [timer1, setTimer1] = useState(0)
  const [timer2, setTimer2] = useState(0)
  const [isTimer1Running, setIsTimer1Running] = useState(false)
  const workerRef = useRef<Worker | null>(null)

  const [capySound] = useSound(carpincho)

  useEffect(() => {
    // Cargar el Web Worker
    workerRef.current = new Worker('worker.js')

    // Escuchar los mensajes del worker
    workerRef.current.onmessage = event => {
      const { timer1, timer2 } = event.data as Record<string, number>
      setTimer1(timer1)
      setTimer2(timer2)
      if (timer1 >= 600 && isTimer1Running) {
        pauseTimer1()
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

  const startTimer1 = () => {
    if (!workerRef.current) return
    workerRef.current.postMessage('startTimer1')
    setIsTimer1Running(true)
  }

  const pauseTimer1 = () => {
    if (!workerRef.current) return
    workerRef.current.postMessage('pauseTimer1')
    setIsTimer1Running(false)
  }

  const resetTimers = () => {
    if (!workerRef.current) return
    workerRef.current.postMessage('reset')
    setTimer1(0)
    setTimer2(0)
    setIsTimer1Running(false)
  }

  return (
    <>
      <Helmet>
        <title>{`1:${formatTime(timer1)} - 2:${formatTime(timer2)}`}</title>
      </Helmet>
      <div className='flex flex-col'>
        <div className='flex flex-row items-center justify-center gap-2'>
          <h1 className='text-2xl font-bold'>
            Tiempo de estudio: {formatTime(timer1)}
          </h1>
          <h1 className='text-2xl font-bold'>
            Tiempo de descanso: {formatTime(timer2)}
          </h1>
        </div>
        <div className='flex flex-row items-center justify-center gap-4'>
          {!isTimer1Running ? (
            <Button onClick={startTimer1}>Estudiar</Button>
          ) : (
            <Button onClick={pauseTimer1}>Descansar</Button>
          )}
          <Button onClick={resetTimers}>Reset Both Timers</Button>
        </div>
      </div>
    </>
  )
}
