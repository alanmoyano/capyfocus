import { useEffect, useState } from 'react'
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
import AnimacionChicho from './ComponentesEspecifico/AnimacionChicho'
import useTimer from '@/hooks/useTimer'
import { Helmet } from 'react-helmet'
import { formatTime } from '@/lib/utils'
import { useSession } from './contexts/SessionContext'
import { supabase } from './supabase/client'
import { dateToTimetz } from '@/constants/supportFunctions'

//import Confetti from 'react-confetti-boom'

type Mode = 'Sesión' | 'Descanso'
type Accion = 'Estudiar' | 'Descansar'

type SessionAGuardar = {
  uuid: string
  horaInicioSesion: string
  fecha: Date
  horaFinSesion: string
  tecnicaEstudio: number
  tipoMotivacion: number
  cantidadObjetivosCumplidos: number
  cantidadObjetivos: number
  tiempoEstudio: number
}

async function acumulateHoursInFavouriteObj(
  objName: string,
  time: number,
  uuid: string
) {
  const { data, error } = await supabase
    .from('ObjetivosFavoritos')
    .update({ horasAcumuladas: time })
    .eq('descripcion', objName)
    .eq('idUsuario', uuid)

  if (error) console.log(error)
  else console.log(data)
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
  const [sessionStart, setSessionStart] = useState(false)
  const [InicioSesion, setInicioSesion] = useState<Date | null>(null)
  const { session } = useSession()
  const {
    objetivos,
    setObjetivos,
    objetivosFav,
    setTiempo,
    tiempo,
    setTiempoSesion,
    setObjetivosPend,
    setTiempoFavorito,
    tiempoFavorito,
  } = useObjetivos()
  const [marked, setMarked] = useState<string[]>([])
  const { selectedMusic } = useMusic()
  const { setTiempoTotal, setAcumuladorTiempoPausa, setCantidadPausas } =
    useSesion()

  const finalizarSesion = () => {
    if (session) {
      const hoy = new Date()
      async function saveSession() {
        const sessionToSave: SessionAGuardar = {
          //@ts-expect-error no jodas ts, anda en la bd
          uuid: session?.user.id,
          horaInicioSesion: dateToTimetz(InicioSesion),
          //@ts-expect-error no jodas ts, anda en la bd
          fecha: InicioSesion,
          horaFinSesion: dateToTimetz(hoy),
          tecnicaEstudio: 2,
          tipoMotivacion: motivationType === 'Positiva' ? 1 : 2,
          cantidadObjetivosCumplidos: objCumplidos,
          cantidadObjetivos: objetivos.length,
          tiempoEstudio: studyTime,
        }

        const { data, error } = await supabase
          .from('SesionesDeEstudio')
          .insert([
            {
              idUsuario: sessionToSave.uuid,
              horaInicioSesion: sessionToSave.horaInicioSesion,
              fecha: sessionToSave.fecha,
              horaFinSesion: sessionToSave.horaFinSesion,
              tecnicaEstudio: sessionToSave.tecnicaEstudio,
              tipoMotivacion: sessionToSave.tipoMotivacion,
              cantidadObjetivosCumplidos:
                sessionToSave.cantidadObjetivosCumplidos,
              cantidadObjetivos: sessionToSave.cantidadObjetivos,
              tiempoEstudio: sessionToSave.tiempoEstudio,
            },
          ])

        if (error) console.log(error)
        else console.log(data)
      }
      saveSession()
        .then(() => console.log('Datos guardados correctamente'))
        .catch((error: unknown) => console.log(error))
    }

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
    if (!sessionStart) {
      setAcumuladorTiempoPausa(0)
      setTiempoTotal(0)
      setCantidadPausas(0)
      setSessionStart(true)
      setTiempo({})
      setTiempoSesion({})
    }
    setObjetivosPend(objetivos)
    startStudy()
    const hoy = new Date()
    setInicioSesion(hoy)
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

      if (objetivosFav.includes(objetivo)) {
        const timeToSave = studyTime
        if (!tiempoFavorito[objetivo]) {
          setTiempoFavorito(prev => ({ ...prev, [objetivo]: timeToSave }))
          if (session) {
            acumulateHoursInFavouriteObj(objetivo, timeToSave, session.user.id)
              .then(() => {
                console.log('Datos actualizados correctamente')
              })
              .catch((error: unknown) => {
                console.log('Ocurrio un error', error)
              })
          }
        } else {
          const timeToSave = studyTime + (tiempoFavorito[objetivo] ?? 0)
          setTiempoFavorito(prev => ({
            ...prev,
            [objetivo]: timeToSave,
          }))
          if (session) {
            acumulateHoursInFavouriteObj(objetivo, timeToSave, session.user.id)
              .then(() => {
                console.log('Datos actualizados correctamente')
              })
              .catch((error: unknown) => {
                console.log('Ocurrio un error', error)
              })
          }
        }
        // const tiempoAnterior = tiempoFavorito[objetivo] ?? 0
        // console.log(tiempo)
        // setTiempoFavorito(prev => (
        //   ...prev,
        //   [objetivo]: tiempoAnterior + studyTime,
        // }))
      }
    } else {
      setTiempo(prev => ({
        ...prev,
        [objetivo]: studyTime - tiempoObjAcumulado,
      }))
      setTiempoSesion(prev => ({ ...prev, [objetivo]: studyTime }))
      if (objetivosFav.includes(objetivo)) {
        if (!tiempoFavorito[objetivo]) {
          setTiempoFavorito(prev => ({
            ...prev,
            [objetivo]: studyTime - tiempoObjAcumulado,
          }))
        } else {
          setTiempoFavorito(prev => ({
            ...prev,
            [objetivo]:
              studyTime + (tiempoFavorito[objetivo] ?? 0) - tiempoObjAcumulado,
          }))
        }
      }
    }
    setLastCheckedObj(key)
  }

  return (
    <>
      <Helmet>
        {studyTime <= 0 ? (
          <title>CapyMetro!</title>
        ) : (
          <title>{`${isStudying ? 'Estudiando' : 'Descansando'}: ${isStudying ? formatTime(studyTime) : formatTime(breakTime)}`}</title>
        )}
      </Helmet>

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
