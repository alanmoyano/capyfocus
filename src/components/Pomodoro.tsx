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
  const [objCumplidos, setObjCumplidos] = useState(0)
  const [countdown, setCountdown] = useState(sessionSeconds)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<Mode>('Estudiando')
  const timer = useRef<NodeJS.Timeout>()
  const pomodoroCount = useRef(0)
  const [capySound] = useSound(CapySound)
  const [ObjStudyTime, setObjStudyTime] = useState(0)
  const { selectedMusic } = useMusic()
  const { motivationType } = useMotivation()
  const { objetivos, setObjetivos, objetivosFav, setTiempo, tiempo } =
    useObjetivos()
  const [marked, setMarked] = useState<string[]>([])
  const [, setLocation] = useLocation()

  const finalizarSesion = () => {
    clearInterval(timer.current)

    objetivos.forEach(objetivo => {
      if (!tiempo[objetivo]) {
        setTiempo(prev => ({
          ...prev,
          [objetivo]: 0
        }))
      }
    })
    // setLocation('/capyEstadisticas')
  }

  //Revisar el funcionamiento de esta cosa!!!

  // useEffect(() => {
  //   const worker = new Worker('worker.js')

  //   worker.postMessage('start')
  //   worker.onmessage = () => console.log('hola!')

  //   return () => worker.terminate()
  // }, [])

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
      setCountdown(mode === 'Estudiando' ? breakSeconds : sessionSeconds)
      setMode(prev => (prev === 'Estudiando' ? 'Descansando' : 'Estudiando'))
      pomodoroCount.current += 0.5
    }

    if (objetivos.length === objCumplidos && objetivos.length > 0) {
      finalizarSesion()
    }

    return () => clearInterval(timer.current)
  }, [
    isActive,
    countdown,
    sessionSeconds,
    breakSeconds,
    mode,
    capySound,
    objCumplidos
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

  const handleCheckbox = (objetivo: string, key: number) => {
    if (marked.includes(objetivo)) {
      return
    }
    setMarked([...marked, objetivo])
    setObjCumplidos(prev => prev + 1)
    console.log(
      'Checkbox activado para objetivo:',
      objetivo,
      ', Key:',
      key,
      'Tiempo dedicado:',
      ObjStudyTime
    )
    setTiempo(prev => ({
      ...prev,
      [objetivo]: ObjStudyTime
    }))

    setObjStudyTime(0)
  }

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>Capydoro!</h1>
      {/* Columna imagen  */}
      <div className='grid grid-cols-2 gap-12'>
        <div className=''>
          <video src='/idle.webm' autoPlay loop muted playsInline />

          <div className='mb-4 rounded-lg bg-primary p-2'>
            Tu tipo de motivación es:{' '}
            <span className='font-semibold'>{motivationType}</span>
          </div>
          <div>
            {selectedMusic && (
              <iframe
                style={{ borderRadius: '12px' }}
                src={`https://open.spotify.com/embed/playlist/${selectedMusic.spotifyUri}?utm_source=generator`}
                width='100%'
                height='152'
                frameBorder='0'
                allowFullScreen={true}
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                loading='eager'
              ></iframe>
            )}
          </div>
        </div>
        {/* Columna 2 */}
        <div className=''>
          <p className='mt-8 flex w-full text-xl font-semibold items-center justify-center'>
            Coloca el tiempo a estudiar y descansar
          </p>
          <div className='flex justify-between gap-4'>
            {/* subit y bajar tiempo de estudio */}
            <div className='w-1/2 p-4 text-center'>
              <div className='mt-2 items-center justify-center font-semibold gap-2 rounded-xl bg-secondary/60 p-2'>
                <h3>Minutos de Estudio</h3>
                <div className='flex items-center justify-center text-lg gap-4'>
                  <Button
                    className=''
                    onClick={() => setSessionSeconds(prev => prev - 60)}
                    disabled={sessionSeconds <= 60 || isActive}
                  >
                    -
                  </Button>
                  <p>{sessionSeconds / 60}</p>
                  <Button
                    onClick={() => setSessionSeconds(prev => prev + 60)}
                    disabled={isActive}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            <div className='w-1/2 p-4 text-center'>
              <div className='mt-2 items-center justify-center gap-2 rounded-xl font-semibold bg-secondary/60 p-2'>
                <h3>Minutos de descanso</h3>
                <div className='flex items-center text-lg justify-center gap-4'>
                  <Button
                    onClick={() => setBreakSeconds(prev => prev - 60)}
                    disabled={breakSeconds <= 60 || isActive}
                  >
                    -
                  </Button>
                  <p> {breakSeconds / 60}</p>
                  <Button
                    onClick={() => setBreakSeconds(prev => prev + 60)}
                    disabled={isActive}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-8 flex justify-center'>
            <span className='rounded-xl bg-secondary/90 py-4 px-12'>
              <ActualTimer mode={mode} time={countdown} />
              {pomodoroCount.current >= 1 && (
                <Confetti mode='boom' particleCount={150} />
              )}
              {/* <Confetti mode='boom' particleCount={150} /> */}

              <p className=''>
                Capydoros: {Math.floor(pomodoroCount.current)}
              </p>
            </span>
          </div>
          <div className='mt-4 flex justify-center'>
            <Button className='' onClick={() => setIsActive(prev => !prev)}>
              {isActive ? 'Terminar' : 'Empezar'}
            </Button>
          </div>

          <div className='mt-4 rounded-xl bg-accent/90 p-4'>
            <h1 className='text-xl'>Objetivos de la sesión:</h1>
            <ul className='list-inside list-disc space-y-2 text-black'>
              {objetivos.map((objetivo, key) => (
                <li key={key} className='flex items-center space-x-2'>
                  <span className='flex items-center'>
                    <Checkbox
                      checked={marked.includes(objetivo)}
                      disabled={mode === 'Descansando' || !isActive}
                      onClick={() => handleCheckbox(objetivo, key)}
                      className='mr-2'
                    />
                    <span>{objetivo}</span>
                  </span>
                  {objetivosFav.includes(objetivo) && (
                    <Star size={20} style={{ color: '#ffbc05' }} />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className='container mt-8 flex w-full gap-44'>
            <div className='flex items-start justify-start'>
              <Button onClick={handleAccept}>Volver</Button>
            </div>
            <div className='flex justify-end'>
              <Button
                className=''
                variant={'destructive'}
                onClick={finalizarSesion}
              >
                Finalizar Sesion
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
