import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { useLocation } from 'wouter'
import { useObjetivos } from './contexts/ObjetivosContext'
import { Star } from 'lucide-react'
import CapySound from '../assets/Sonido_de_caripincho.mp3'
import Confetti from 'react-confetti-boom'
import useSound from 'use-sound'
import { useMusic } from './contexts/MusicContext'
import { useMotivation } from './contexts/MotivationContext'
import { useSesion } from './contexts/SesionContext'
import DialogoChicho from './ComponentesEspecifico/DialogoChicho'
import AnimacionChicho from './ComponentesEspecifico/AnimacionChicho'
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

type Pomodoro = {
  tiempoEstudio: number
  tiempoDescanso: number
}

export default function Pomodoro() {
  const [sessionSeconds, setSessionSeconds] = useState(25 * 60)
  const [breakSeconds, setBreakSeconds] = useState(5 * 60)
  const [objCumplidos, setObjCumplidos] = useState(0)
  const [countdown, setCountdown] = useState(sessionSeconds)
  const [isActive, setIsActive] = useState(false)
  const [isSetted, setIsSetted] = useState(false)
  const [mode, setMode] = useState<Mode>('Estudiando')
  const timer = useRef<NodeJS.Timeout>()
  const pomodoroCount = useRef(0)
  const [pomodorosRealizados, setPomodorosRealizados] = useState<Pomodoro[]>([])
  const [capySound] = useSound(CapySound)
  const [ObjStudyTime, setObjStudyTime] = useState(0)
  const { selectedMusic } = useMusic()
  const { motivationType } = useMotivation()
  const {
    objetivos,
    setObjetivos,
    objetivosFav,
    setTiempo,
    tiempo,
    setTiempoSesion,
    setObjetivosPend,
  } = useObjetivos()
  const [marked, setMarked] = useState<string[]>([])
  const [, setLocation] = useLocation()
  const {
    setTiempoTotal,
    setAcumuladorTiempoPausa,
    setCantidadPausas,
    tiempoTotal,
  } = useSesion()

  const finalizarSesion = () => {
    clearInterval(timer.current)

    if (countdown > 0 && mode === 'Estudiando') {
      console.log('entre en el primero')
      setTiempoTotal(prev => (prev -= countdown))
      setAcumuladorTiempoPausa(prev => (prev -= breakSeconds))
    } else if (countdown > 0 && mode === 'Descansando') {
      console.log('entre en el segundo')
      setAcumuladorTiempoPausa(prev => (prev -= countdown))
    }
    objetivos.forEach(objetivo => {
      if (!tiempo[objetivo]) {
        setTiempo(prev => ({
          ...prev,
          [objetivo]: 0,
        }))
      }
    })
    setLocation('/capyEstadisticas?period=sesion')
  }

  //Revisar el funcionamiento de esta cosa!!!

  useEffect(() => {
    const worker = new Worker('worker.js')

    worker.postMessage('start')
    worker.onmessage = () => console.log('hola!')

    return () => worker.terminate()
  }, [])

  useEffect(() => {
    if (!isActive) return () => clearInterval(timer.current)

    if (countdown >= 0) {
      timer.current = setInterval(() => {
        //console.log(`Hola! actualizando, tiempo: ${formatTime(countdown)}`)
        setCountdown(prev => prev - 1)
        if (mode === 'Estudiando') {
          setObjStudyTime(prev => prev + 1)
        }
      }, 1000)
    } else {
      capySound()
      clearInterval(timer.current)
      if (mode === 'Estudiando') {
        setCountdown(breakSeconds)
        setSessionSeconds(
          pomodorosRealizados[pomodorosRealizados.length - 1].tiempoEstudio
        )
        setMode('Descansando')
        setIsActive(false)
      } else {
        setMode('Estudiando')
        setBreakSeconds(
          pomodorosRealizados[pomodorosRealizados.length - 1].tiempoDescanso
        )
        setIsActive(prev => !prev)
        setIsSetted(prev => !prev)
        pomodoroCount.current += 1
      }
    }

    if (objetivos.length === objCumplidos && objetivos.length > 0) {
      finalizarSesion()
    }

    return () => clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isActive,
    countdown,
    sessionSeconds,
    breakSeconds,
    mode,
    capySound,
    objCumplidos,
  ])

  useEffect(() => {
    setCountdown(mode === 'Estudiando' ? sessionSeconds : breakSeconds)
  }, [mode, sessionSeconds, breakSeconds])

  const handleAccept = () => {
    setLocation('/')
    setObjetivos(prevObjetivos =>
      prevObjetivos.filter(obj => !marked.includes(obj))
    )
  }

  const handleCheckbox = (objetivo: string) => {
    if (marked.includes(objetivo)) {
      return
    }
    setMarked([...marked, objetivo])
    setObjCumplidos(prev => prev + 1)
    setObjetivosPend(prevObjetivosPend =>
      prevObjetivosPend.filter(item => item !== objetivo)
    )
    setTiempo(prev => ({
      ...prev,
      [objetivo]: ObjStudyTime,
    }))
    setTiempoSesion(prev => ({ ...prev, [objetivo]: tiempoTotal - countdown }))

    setObjStudyTime(0)
  }

  const handleSetted = (Sessioncountup: number, Breakcountup: number) => {
    setIsSetted(prev => !prev)
    const tiempoEstudio = Sessioncountup
    const tiempoDescanso = Breakcountup

    const pomodoro: Pomodoro = {
      tiempoEstudio: tiempoEstudio,
      tiempoDescanso: tiempoDescanso,
    }
    if (pomodorosRealizados.length === 0) {
      setPomodorosRealizados([pomodoro])
    } else {
      setPomodorosRealizados([...pomodorosRealizados, pomodoro])
    }
    setTiempoTotal(prev => (prev += tiempoEstudio))
    setAcumuladorTiempoPausa(prev => (prev += tiempoDescanso))
    setIsActive(prev => !prev)
  }

  const handlePause = (value: boolean) => {
    if (!value) {
      setCantidadPausas(prev => (prev += 1))
    }
    setIsActive(value)
  }

  useEffect(() => {
    setObjetivosPend(objetivos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold text-center'>Capydoro!</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='px-4 mt-4'>
          <DialogoChicho motivation={motivationType} />
          <AnimacionChicho motivation={motivationType} />
          <div className='mb-4 rounded-lg bg-primary p-2 text-center'>
            Tu tipo de motivación es: <span className='font-semibold'>{motivationType}</span>
          </div>
          <div className='w-full'>
            {selectedMusic && (
              <iframe
                className='rounded-lg w-full h-40'
                src={`https://open.spotify.com/embed/playlist/${selectedMusic.spotifyUri}?utm_source=generator`}
                frameBorder='0'
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                loading='eager'
              ></iframe>
            )}
          </div>
        </div>
        <div className='px-4'>
          <p className='mt-8 text-center text-xl font-semibold'>Coloca el tiempo a estudiar y descansar</p>
          <div className='flex flex-col md:flex-row justify-between gap-4'>
            <div className='w-full md:w-1/2 p-4 text-center'>
              <div className='mt-2 items-center justify-center gap-2 rounded-xl bg-secondary/60 p-2 font-semibold'>
                <h3>Minutos de Estudio</h3>
                <div className='flex items-center justify-center gap-4 text-lg'>
                  <Button onClick={() => setSessionSeconds(prev => prev - 60)} disabled={sessionSeconds <= 60 || isActive || isSetted}>-</Button>
                  <p>{sessionSeconds / 60}</p>
                  <Button onClick={() => setSessionSeconds(prev => prev + 60)} disabled={isActive || isSetted}>+</Button>
                </div>
              </div>
            </div>
            <div className='w-full md:w-1/2 p-4 text-center'>
              <div className='mt-2 items-center justify-center gap-2 rounded-xl bg-secondary/60 p-2 font-semibold'>
                <h3>Minutos de descanso</h3>
                <div className='flex items-center justify-center gap-4 text-lg'>
                  <Button onClick={() => setBreakSeconds(prev => prev - 60)} disabled={breakSeconds <= 60 || isActive || isSetted}>-</Button>
                  <p>{breakSeconds / 60}</p>
                  <Button onClick={() => setBreakSeconds(prev => prev + 60)} disabled={isActive || isSetted}>+</Button>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-8 flex justify-center'>
            <span className='rounded-xl bg-secondary/90 text-black px-12 py-4 text-center'>
              <ActualTimer mode={mode} time={countdown} />
              {pomodoroCount.current >= 1 && <Confetti mode='boom' particleCount={150} />}
              <p className='text-black'>Capydoros: {Math.floor(pomodoroCount.current)}</p>
            </span>
          </div>
          <div className='mt-4 flex justify-center'>
            {!isSetted ? (
              <Button onClick={() => handleSetted(sessionSeconds, breakSeconds)}>Empezar</Button>
            ) : (
              <Button onClick={() => handlePause(!isActive)}>{isActive ? 'Pausar' : 'Reanudar'}</Button>
            )}
          </div>
          <div className='mt-4 rounded-xl bg-accent/90 p-4'>
            <h1 className='text-xl'>Objetivos de la sesión:</h1>
            <ul className='list-inside list-disc space-y-2 text-black'>
              {objetivos.map((objetivo, key) => (
                <li key={key} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={marked.includes(objetivo)}
                    disabled={mode === 'Descansando' || !isActive}
                    onClick={() => handleCheckbox(objetivo)}
                    className='mr-2'
                  />
                  <span>{objetivo}</span>
                  {objetivosFav.includes(objetivo) && <Star size={20} style={{ color: '#ffbc05' }} />}
                </li>
              ))}
            </ul>
          </div>
          <div className='container mt-4 flex flex-col md:flex-row justify-end'>
            <Button variant={'destructive'} onClick={finalizarSesion}>Finalizar Sesion</Button>
          </div>
          <div className='container w-full mt-8'>

           
          </div>
        </div>
      </div>
    </>
  )
}
