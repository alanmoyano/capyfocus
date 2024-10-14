import { formatTime } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import usePomodoro from '@/hooks/usePomodoro'

type props = {
  timeLeft: number
  isWorking: boolean
}

export default function Prueba() {
  const { time, isStudying, pauseStudy, resumeStudy, startStudy } =
    usePomodoro()

  const [sessionTime, setSessionTime] = useState(1 * 60)
  const [restTime, setRestTime] = useState(1 * 60)

  const [started, setStarted] = useState<boolean>(false)

  function mode() {
    if (!started) return 'Estudio'
    return isStudying ? 'Estudio' : 'Descanso'
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-row items-center justify-center gap-2'>
          <h1 className='text-2xl font-bold'>
            Tiempo de {mode()}: {formatTime(time ?? sessionTime)}
          </h1>
        </div>
        <div className='flex flex-col justify-between gap-4 md:flex-row'>
          <div className='w-full p-4 text-center md:w-1/2'>
            <div className='mt-2 items-center justify-center gap-2 rounded-xl bg-secondary/60 p-2 font-semibold'>
              <h3>Minutos de Estudio</h3>
              <div className='flex items-center justify-center gap-4 text-lg'>
                <Button
                  onClick={() => setSessionTime(prev => prev - 60)}
                  disabled={started || sessionTime <= 60 || isStudying}
                >
                  -
                </Button>
                <p>{sessionTime / 60}</p>
                <Button
                  onClick={() => setSessionTime(prev => prev + 60)}
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
                  disabled={started || restTime <= 60 || isStudying}
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
            <Button onClick={() => (isStudying ? pauseStudy() : resumeStudy())}>
              {isStudying ? 'Pausar' : 'Resumir'}
            </Button>
          ) : (
            <Button
              onClick={() => {
                startStudy({ studyTime: sessionTime, breakTime: restTime })
                setStarted(prev => !prev)
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
