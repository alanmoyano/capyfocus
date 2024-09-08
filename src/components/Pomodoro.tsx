import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { useLocation } from 'wouter'
import { useObjetivos } from './ObjetivosContext'
import { Star } from 'lucide-react'
import CapySound from '../assets/Sonido_de_caripincho.mp3'
import Confetti from 'react-confetti-boom'
import useSound from 'use-sound'

type Mode = 'Estudiando' | 'Descansando'

function addZeroIfNeeded(value: number) {
  return value.toString().padStart(2, '0')
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${addZeroIfNeeded(minutes)}:${addZeroIfNeeded(remainingSeconds)}`
}

export function ActualTimer({ time, mode }: { time: number; mode: Mode }) {
  return (
    <>
      <h2 className='flex justify-center text-xl'>
        <span className='font-semibold'>{mode}</span>
      </h2>
      <p className='text-lg'> </p>
      <span className='flex items-center justify-center text-3xl font-bold'>
        {formatTime(time)}
      </span>
    </>
  )
}

export default function Pomodoro() {
  const [sessionSeconds, setSessionSeconds] = useState(25 * 60)
  const [breakSeconds, setBreakSeconds] = useState(5 * 60)
  const [countdown, setCountdown] = useState(sessionSeconds)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<Mode>('Estudiando')
  const timer = useRef<NodeJS.Timeout>()
  const pomodoroCount = useRef(0)
  const [capySound] = useSound(CapySound)
  const [ObjStudyTime, setObjStudyTime] = useState(0)
  useEffect(() => {
    if (!isActive) return () => clearInterval(timer.current)

    if (countdown >= 0) {
      timer.current = setInterval(() => {
        setCountdown(prev => prev - 1)
        if (mode === 'Estudiando'){
          setObjStudyTime(prev => prev + 1)
        }
      }, 1000)
    } else {
      capySound()
      clearInterval(timer.current)
      setCountdown(mode === 'Estudiando' ? breakSeconds : sessionSeconds)
      setMode(prev => (prev === 'Estudiando' ? 'Descansando' : 'Estudiando'))
      pomodoroCount.current += 0.5
    }

    return () => clearInterval(timer.current)
  }, [isActive, countdown, sessionSeconds, breakSeconds, mode, capySound])

  useEffect(() => {
    setCountdown(mode === 'Estudiando' ? sessionSeconds : breakSeconds)
  }, [mode, sessionSeconds, breakSeconds])

  const [lastCheckedObj, setLastCheckedObj] = useState<number | null>(null)
  const { objetivos, setObjetivos, objetivosFav, tiempo, setTiempo } =
    useObjetivos()
  const [marked, setMarked] = useState<string[]>([])
  const [, setLocation] = useLocation()
  const handleAccept = () => {
    setLocation('/')
    setObjetivos(prevObjetivos =>
      prevObjetivos.filter(obj => !marked.includes(obj))
    )
  }

  const handleCheckbox = (objetivo: string, key: number) => {
    // Ver cómo hacer para contabilizar el tiempo entre sesiones de un obj.
    if (marked.includes(objetivo)) {
      return
    }
    setMarked([...marked, objetivo])
    //const timeSinceActive = sessionSeconds - countdown
    console.log(
      'Checkbox activado para objetivo:',
      objetivo,
      ', Key:',
      key,
      'Tiempo dedicado:',
      ObjStudyTime
    )
    if (lastCheckedObj === null) {
      setTiempo(prev => ({
        ...prev,
        [objetivo]: ObjStudyTime
      }))
    } else {
      const tiempoObjAnterior = tiempo[objetivos[lastCheckedObj]]
      if (tiempoObjAnterior) {
        setTiempo(prev => ({
          ...prev,
          [objetivo]: ObjStudyTime
        }))
      }
    }
    setLastCheckedObj(key)
    setObjStudyTime(0)
  }

  return (
    <>
      <h1 className='mb-6 text-4xl font-bold'>Capydoro</h1>
      <div className='flex w-1/2 justify-end'>
        <span className='rounded-xl bg-secondary/60 p-4'>
          <ActualTimer mode={mode} time={countdown} />
          {pomodoroCount.current >= 1 && (
            <Confetti mode='boom' particleCount={150} />
          )}
          {/* <Confetti mode='boom' particleCount={150} /> */}

          <p className=''>
            Pomodoro count: {Math.floor(pomodoroCount.current)}
          </p>
        </span>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {/* Primer columna */}
        <div className='col-span-1'>
          <img src='/idle.gif' />
        </div>

        {/* Segunda columna  */}
        <div className='col-span-1 mt-9 grid grid-cols-2 gap-4'>
          <div className='text-black'>
            <div className='mt-4 flex items-center justify-center gap-2 rounded-xl bg-secondary/60 p-4'>
              <Button
                onClick={() => setSessionSeconds(10)}
                disabled={sessionSeconds <= 60 || isActive}
              >
                -
              </Button>
              <p>Tiempo de Estudio: {sessionSeconds / 60}</p>
              <Button
                onClick={() => setSessionSeconds(prev => prev + 60)}
                disabled={isActive}
              >
                +
              </Button>
            </div>
          </div>
          {/* Tercer columna */}
          <div className='text-black'>
            <div className='mt-4 flex items-center justify-center gap-2 rounded-xl bg-secondary/60 p-4'>
              <Button
                onClick={() => setBreakSeconds(10)}
                disabled={breakSeconds <= 60 || isActive}
              >
                -
              </Button>
              <p>Tiempo de Descanso: {breakSeconds / 60}</p>
              <Button
                onClick={() => setBreakSeconds(prev => prev + 60)}
                disabled={isActive}
              >
                +
              </Button>
            </div>
            <div className='flex w-full justify-end'>
              <Button
                className='mt-2'
                onClick={() => setIsActive(prev => !prev)}
              >
                {isActive ? 'Desactivar' : 'Empezar'}
              </Button>
            </div>
            <div className='mt-4 rounded-xl bg-accent/90 p-4'>
              <h1 className='text-xl'>Objetivos de la sesión:</h1>
              <ul className='list-inside list-disc space-y-2 text-black'>
                {objetivos.map((objetivo, key) => (
                  <li key={key} className='flex items-center space-x-2'>
                    <span>
                      <Checkbox
                        checked={marked.includes(objetivo)}
                        disabled={mode === 'Descansando' || !isActive}
                        onClick={() => handleCheckbox(objetivo, key)}
                        className='mr-2'
                      />
                      {objetivo}
                    </span>
                    {objetivosFav.includes(objetivo) && (
                      <Star size={20} style={{ color: '#ffbc05' }} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex w-full justify-end'>
              <Button className='mt-6' variant={'destructive'}>
                Finalizar Sesion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Button className='flex flex-col' onClick={handleAccept}>
          Volver
        </Button>
      </div>
    </>
  )
}
