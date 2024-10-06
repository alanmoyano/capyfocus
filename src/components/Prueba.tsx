import useTimer from '@/hooks/useTimer'
import { formatTime } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'

type props = {
  timeLeft: number
  isWorking: boolean
}

export default function Prueba() {
  const [time, setTime] = useState<number | null>()

  const [studyTime, setStudyTime] = useState(25 * 60)
  const [restTime, setRestTime] = useState(5 * 60)

  const [working, setWorking] = useState<boolean | null>(null)
  const [started, setStarted] = useState<boolean>(false)

  const workerRef = useRef<Worker | null>()

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/capydoro.ts', import.meta.url)
    )

    workerRef.current.onmessage = event => {
      const { timeLeft, isWorking } = event.data as props
      setTime(timeLeft)
      setWorking(isWorking)
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-row items-center justify-center gap-2'>
          <h1 className='text-2xl font-bold'>
            Tiempo de {(working ?? 'Estudio') ? 'Estudio' : 'Descanso'}:{' '}
            {formatTime(time ?? studyTime)}
          </h1>
        </div>
        <div className='flex flex-col justify-between gap-4 md:flex-row'>
          <div className='w-full p-4 text-center md:w-1/2'>
            <div className='mt-2 items-center justify-center gap-2 rounded-xl bg-secondary/60 p-2 font-semibold'>
              <h3>Minutos de Estudio</h3>
              <div className='flex items-center justify-center gap-4 text-lg'>
                <Button
                  onClick={() => setStudyTime(prev => prev - 60)}
                  disabled={(started || studyTime <= 60 || working) ?? false}
                >
                  -
                </Button>
                <p>{studyTime / 60}</p>
                <Button
                  onClick={() => setStudyTime(prev => prev + 60)}
                  disabled={started}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          <div className='w-full p-4 text-center md:w-1/2'>
            <div className='mt-2 items-center justify-center gap-2 rounded-xl bg-secondary/60 p-2 font-semibold'>
              <h3>Minutos de descanso</h3>
              <div className='flex items-center justify-center gap-4 text-lg'>
                <Button
                  onClick={() => setRestTime(prev => prev - 60)}
                  disabled={(started || restTime <= 60 || working) ?? false}
                >
                  -
                </Button>
                <p>{restTime / 60}</p>
                <Button
                  onClick={() => setRestTime(prev => prev + 60)}
                  disabled={started}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-row items-center justify-center gap-4'>
          {started ? (
            <Button
              onClick={() => {
                workerRef.current?.postMessage({
                  action: working ? 'pause' : 'resume',
                })
                setWorking(prev => !prev)
              }}
            >
              {working ? 'Pausar' : 'Resumir'}
            </Button>
          ) : (
            <Button
              onClick={() => {
                workerRef.current?.postMessage({
                  action: 'start',
                  studyTime,
                  restTime,
                })
                setStarted(true)
              }}
            >
              Iniciar
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
