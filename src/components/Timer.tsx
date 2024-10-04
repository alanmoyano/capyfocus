import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { useLocation } from 'wouter'
import { useObjetivos } from './contexts/ObjetivosContext'
import { Star, NotebookPen, Moon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
//import { navigationMenuTriggerStyle } from './ui/navigit pull gation-menu'
import { useMusic } from './contexts/MusicContext'
import { useMotivation } from './contexts/MotivationContext'
import { useSesion } from './contexts/SesionContext'
import DialogoChicho from './ComponentesEspecifico/DialogoChicho'
import AnimacionChicho2 from './ComponentesEspecifico/AnimacionChicho2'
import AnimacionChicho from './ComponentesEspecifico/AnimacionChicho'
import useTimer from '@/hooks/useTimer'
//import Confetti from 'react-confetti-boom'

type Mode = 'Sesión' | 'Descanso'
type Accion = 'Estudiar' | 'Descansar'

function addZeroIfNeeded(value: number) {
  return value.toString().padStart(2, '0')
}

function formatTime(time: number) {
  const hours = Math.floor(time / 3600) // Calcula las horas
  const minutes = Math.floor((time % 3600) / 60) // Calcula los minutos restantes
  const remainingSeconds = time % 60 // Calcula los segundos restantes

  if (hours > 0) {
    return `${addZeroIfNeeded(hours)}:${addZeroIfNeeded(minutes)}:${addZeroIfNeeded(remainingSeconds)}`
  } else {
    return `${addZeroIfNeeded(minutes)}:${addZeroIfNeeded(remainingSeconds)}`
  }
}

export function ActualTimer({ time, mode }: { time: number; mode: Mode }) {
  return (
    <>
      <h2 className='text-xl font-semibold'>{mode}</h2>

      <span className='text-lg'>Tiempo: {formatTime(time)}</span>
    </>
  )
}

export default function Timer() {
  const {
    studyTime,
    breakTime,
    isStudying,
    startStudy,
    pauseStudy,
    finalizeTimers,
  } = useTimer()

  const [tiempoObjAcumulado, setTiempoObjAcumulado] = useState(0)
  const [objCumplidos, setObjCumplidos] = useState(0)

  const [mode, setMode] = useState<Mode>('Sesión')

  const { motivationType } = useMotivation()
  // // @ts-expect-error vamos a usar la descripción después, no te enojes typescript!!! 🥺

  const [, setDescription] = useState<Accion>('Estudiar')
  const [, setLocation] = useLocation()
  const [lastCheckedObj, setLastCheckedObj] = useState<number | null>(null)
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
  const { selectedMusic } = useMusic()
  const { setTiempoTotal, setAcumuladorTiempoPausa, setCantidadPausas } =
    useSesion()

  const finalizarSesion = () => {
    finalizeTimers()
    setTiempoTotal(studyTime)
    setAcumuladorTiempoPausa(breakTime)
    objetivos.forEach(objetivo => {
      if (!tiempo[objetivo]) {
        setTiempo(prev => ({
          ...prev,
          [objetivo]: 0,
        }))
        setTiempoSesion(prev => ({ ...prev, [objetivo]: 0 }))
      }
    })
    setLocation('/capyEstadisticas?period=sesion')
  }

  useEffect(() => {
    setObjetivosPend(objetivos)
    startStudy()
  }, [])

  useEffect(() => {
    if (!isStudying) {
      setMode('Descanso')
      // Esto esta hecho para que ts no joda pero es una barbaridad y debe ser cambiado lo antes posible
      console.log(mode)
      setCantidadPausas(prev => prev + 1)
      console.log('pausaste')
    } else {
      setMode('Sesión')
    }
    if (objetivos.length === objCumplidos && objetivos.length > 0) {
      finalizarSesion()
    }
  }, [isStudying, objCumplidos])

  /* Esto es para que los botones si los tocas mas de una vez no hagan nada */
  const handleToggle = (value: boolean) => {
    if (isStudying && value) return
    if (!isStudying && !value) return

    finalizeTimers()
    if (value) {
      startStudy()
    } else {
      pauseStudy()
    }
  }

  // useEffect(() => {
  //   setCountdown(mode === 'Session' ? sessionSeconds : breakSeconds)
  // }, [mode, sessionSeconds, breakSeconds])

  const handleAccept = () => {
    setLocation('/')
    setObjetivos(prevObjetivos =>
      prevObjetivos.filter(obj => !marked.includes(obj))
    )
  }

  const handleCheckbox = (objetivo: string, key: number) => {
    if (marked.includes(objetivo)) {
      // Esto sirve para no poder desmarcar los objetivos
      return
    }
    setMarked([...marked, objetivo])
    setObjCumplidos(prev => prev + 1)
    setTiempoObjAcumulado(prev => prev + (studyTime - prev))
    setObjetivosPend(prevObjetivosPend =>
      prevObjetivosPend.filter(item => item !== objetivo)
    )

    if (lastCheckedObj === null) {
      // clearInterval(timer.current)
      setTiempo(prev => ({ ...prev, [objetivo]: studyTime }))
      setTiempoSesion(prev => ({ ...prev, [objetivo]: studyTime }))
    } else {
      setTiempo(prev => ({
        ...prev,
        [objetivo]: studyTime - tiempoObjAcumulado,
      }))
      setTiempoSesion(prev => ({ ...prev, [objetivo]: studyTime }))
    }
    setLastCheckedObj(key)
  }

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyMetro!</h1>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {/* Columna 1:  */}
        <div className='col-span-1 p-4'>
          {/* <AnimacionChicho2 motivation={motivationType} /> */}
          <DialogoChicho motivation={motivationType} />
          <AnimacionChicho motivation={motivationType} />

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

        {/* Columna 2:*/}
        <div className='col-span-1'>
          {/* Contadores */}
          <div className='mt-6 flex w-full flex-col items-center justify-center gap-2 text-black sm:flex-row'>
            <div className='mb-2 w-full rounded-xl bg-accent/90 p-6 sm:mb-0 sm:mr-2'>
              <ActualTimer mode={'Sesión'} time={studyTime} />
            </div>
            <div className='w-full rounded-xl bg-accent/90 p-6'>
              <ActualTimer mode={'Descanso'} time={breakTime} />
            </div>
          </div>
          <div className='mt-8 sm:mt-16'>
            <div className='flex justify-center'>
              <ToggleGroup
                type='single'
                className='mx-auto w-full gap-2 rounded-xl bg-primary/90 p-2 sm:w-2/3'
                onValueChange={value => setDescription(value as Accion)}
              >
                <ToggleGroupItem
                  value='Estudiar'
                  className={`flex w-1/2 items-center justify-center ${isStudying ? 'bg-muted text-muted-foreground' : 'bg-primary/90'}`}
                  onClick={() => handleToggle(true)}
                >
                  <NotebookPen className='mr-2' />
                  Estudiar
                </ToggleGroupItem>
                <ToggleGroupItem
                  value='Descansar'
                  className={`flex w-1/2 items-center justify-center ${isStudying ? 'bg-primary/90' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => handleToggle(false)}
                >
                  <Moon className='mr-2' />
                  Descansar
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          <div className='mt-8 rounded-xl bg-primary/90 p-4'>
            <h1 className='text-xl'>Objetivos de la sesión</h1>
            <ul className='list-inside list-disc space-y-2 text-black'>
              {objetivos.map((objetivo, key) => (
                <li key={key} className='flex items-center space-x-2'>
                  <span className='flex-grow'>
                    <Checkbox
                      checked={marked.includes(objetivo)}
                      onClick={() => {
                        handleCheckbox(objetivo, key)
                      }}
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
          <div className='mt-6 flex flex-col items-center justify-between sm:flex-row'>
            <Button
              className='mb-2 w-full sm:mb-0 sm:w-auto'
              variant={'destructive'}
              onClick={() => {
                finalizarSesion()
              }}
            >
              Finalizar Sesion
            </Button>
            <Button className='w-full sm:w-auto' onClick={handleAccept}>
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* {pomodoroCount.current >= pomodoroSessions && (
        <Confetti effectCount={1} />
        )} */}
    </>
  )
}
