import { KeyboardEvent, useEffect, useState } from 'react'

import { useLocation } from 'wouter'

import { toast } from 'sonner'
import Eventos from './ComponentesEspecifico/Eventos'

import { useSession } from './contexts/SessionContext'

import {
  Check,
  ChevronsUpDown,
  Edit3,
  Hourglass,
  Star,
  StarOff,
  Timer,
  Trash,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useObjetivos } from './contexts/ObjetivosContext'

import { Button } from './ui/button'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { Card, CardContent } from '@/components/ui/card'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useMotivation } from './contexts/MotivationContext'

import { useMusic } from './contexts/MusicContext'

import { useSesion } from '@/components/contexts/SesionContext'

import { Helmet } from 'react-helmet'
import DialogoChicho from './ComponentesEspecifico/DialogoChicho'
import { supabase } from './supabase/client'

import { insigniaQuince } from '@/constants/supportFunctions'
import posthog from 'posthog-js'
import CapyInfo from './ComponentesEspecifico/CapyToast/CapyInfo'
import Reproductor from './ComponentesEspecifico/Reproductor'
import { useEvents } from './contexts/EventsContext'
import { usePreferences } from './contexts/PreferencesContext'
//BUG: Algunos objetivos Favoritos no se ponen como favoritos.
type CapyMetodos = 'Capydoro' | 'Capymetro'

const playlists = [
  {
    key: 1,
    src: './CapyChill.webp',
    alt: 'CapyChill',
    title: 'CapyChill',
    description: 'Música relajante para estudiar con tranquilidad',
    spotifyUri: '7u6QwhygZJJqqGWMMMINhR',
  },
  {
    key: 2,
    src: './CapyAmbiente.jpg',
    alt: 'CapyAmbiente',
    title: 'CapyAmbiente',
    description: 'Sonidos ambientales para mejorar la concentración',
    spotifyUri: '4Pi6DScPJfg1RTGVZuxTZV',
  },
  {
    key: 3,
    src: './CapySinthwave.jpg',
    alt: 'CapySynthwave',
    title: 'CapySynthwave',
    description: 'Música electrónica retro para un estudio energético',
    spotifyUri: '6xYhxczmfgi6L6knoEHktx',
  },
  {
    key: 4,
    src: './CapyEpic.jpg',
    alt: 'CapyEpic',
    title: 'CapyEpic',
    description: 'Música épica para momentos de máxima concentración',
    spotifyUri: '5GnSqO293GdPWaJhD6iz8E',
  },
]

type Motivacion = {
  id: number
  nombre: string
  descripcion?: string
}

type ObjectiveToAdd = {
  descripcion: string
  created_at: string
  idUsuario: string
}

type ObjectiveRecovered = {
  descripcion: string
  created_at: string
  idUsuario: string
  id: number
  horaInicioObjetivo: string
  horaFinObjetivo: string
  idEstado: number
  idEvento: number
  horasAcumuladas: number
}

async function gatherUserPendingObjectives(uuid: string) {
  const { data, error } = await supabase
    .from('ObjetivosFavoritos')
    .select()
    .eq('idUsuario', uuid)
    .eq('idEstado', 1)
  if (data) return data as ObjectiveRecovered[]
  else console.log(error)
}

async function persistFavoriteObjective(
  name: string,
  fechaCreado: Date,
  uuid: string
) {
  const objectiveToAdd: ObjectiveToAdd = {
    descripcion: name,
    created_at: fechaCreado.toISOString(),
    idUsuario: uuid,
  }
  const { data, error } = await supabase.from('ObjetivosFavoritos').insert([
    {
      descripcion: objectiveToAdd.descripcion,
      created_at: objectiveToAdd.created_at,
      idUsuario: objectiveToAdd.idUsuario,
      idEstado: 1,
    },
  ])
}

async function deletePersistedObjective(nombre: string, uuid: string) {
  const { error } = await supabase
    .from('ObjetivosFavoritos')
    .update({ idEstado: 2 })
    .eq('descripcion', nombre)
    .eq('idUsuario', uuid)

  if (error) console.log(error)
}

export default function Inicio() {
  const [open, setOpen] = useState(false)
  const [value] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [index, setIndex] = useState<number | null>(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState(-1)
  const { session } = useSession()
  const [objectivesRecovered, setObjectivesRecovered] = useState(false)
  const { selectedEvent } = useEvents()

  const {
    objetivos,
    setObjetivos,
    objetivosFav,
    setObjetivosFav,
    setTiempoFavorito,
  } = useObjetivos()

  const [description, setDescription] = useState<CapyMetodos>()

  const [, setLocation] = useLocation()

  const { setMotivationType } = useMotivation()

  const { setSelectedMusic } = useMusic()

  const { setTecnicaEstudio, banderaUnicaVez, setBanderaUnicaVez } = useSesion()

  const [motivaciones, setMotivaciones] = useState<Motivacion[]>([])

  const { motivationPreference } = usePreferences()

  const recoverObjectives = () => {
    if (session && objetivosFav.length < 1) {
      setObjectivesRecovered(true)
      gatherUserPendingObjectives(session.user.id)
        .then(data =>
          data?.forEach((objetivo: ObjectiveRecovered) => {
            setTiempoFavorito(prev => ({
              ...prev,
              [objetivo.descripcion]: objetivo.horasAcumuladas,
            }))
            setObjetivosFav(prev => [...prev, objetivo.descripcion])
          })
        )
        .catch((error: unknown) => {
          console.log('Ocurrio un error recuperando los objetivos', error)
        })
    }
  }

  const handleAccept = () => {
    switch (description) {
      case 'Capydoro':
        setLocation('/capydoro')
        setTecnicaEstudio(description)
        posthog.capture('Sesión de Capydoro')
        break
      case 'Capymetro':
        setLocation('capymetro')
        setTecnicaEstudio(description)
        posthog.capture('Sesión de Capymetro')
        break
      case undefined:
        toast.error('CapyError', {
          description: 'Selecciona un método de estudio antes.',
          duration: 5000,
          action: {
            label: 'Aceptar',
            onClick: () => {
              toast.dismiss()
            },
          },
        })
        break
    }
  }

  const handleSelect = (value: string) => {
    setMotivationType(value)
  }

  const handleAdd = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key == 'Enter' &&
      inputValue.trim() != '' &&
      !objetivos.includes(inputValue)
    ) {
      if (objetivos.length === 9) {
        toast.error('CapyError', {
          description:
            'En capyfocus, te ayudamos a mantener márgenes realistas de trabajo, si una sesión tiene más de 10 objetivos, quizás deberías hacer más de una sesión!',

          descriptionClassName: 'text-white',
        })
      }
      setObjetivos([...objetivos, inputValue])
      setInputValue('')
    }
  }

  const handleDelete = (index: number) => {
    const auxObjetivos = objetivos.filter((_, i) => i !== index) //hola a los que no son
    setObjetivos(auxObjetivos)
  }
  const handleEdit = (index: number) => {
    setIndex(index)
    setInputValue(objetivos[index]) // Set the input value to the current objective
  }

  const handleSaveEdit = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key == 'Enter' && inputValue.trim() != '') {
      const auxObjetivos = [...objetivos]
      auxObjetivos[index] = e.currentTarget.value.trim()
      setObjetivos(auxObjetivos)
      setIndex(null)
    }
  }

  const handleFav = (objetivo: string) => {
    if (objetivosFav.includes(objetivo)) {
      setObjetivosFav(
        objetivosFav.filter(objetivoFav => objetivoFav !== objetivo)
      )
      if (session) {
        deletePersistedObjective(objetivo, session.user.id)
          .then(() => {
            console.log('Objetivo completado, felicitaciones')
          })
          .catch((error: unknown) => {
            console.log('Ocurrio un error', error)
          })
      }
    } else {
      if (session) {
        if (objetivosFav.length === 0) {
          recoverObjectives()
        }
        const hoy = new Date()
        persistFavoriteObjective(objetivo, hoy, session.user.id)
          .then(() => {
            console.log('Objetivo persistido correctamente')
          })
          .catch((error: unknown) => {
            console.log('Ocurrio un error: ', error)
          })
      }
      setObjetivosFav([...objetivosFav, objetivo])
    }
  }

  // musica

  const handleMusicSelection = (
    music: {
      title: string
      spotifyUri: string
    },
    idPlaylist: number
  ) => {
    if (idPlaylist === selectedPlaylist) {
      setSelectedMusic(null)
    } else {
      setSelectedMusic(music)
    }
  }

  useEffect(() => {
    async function getMotivaciones() {
      const { data } = await supabase.from('TiposMotivacion').select('*')
      return data
    }

    getMotivaciones()
      .then(data => {
        if (!data) return

        setMotivaciones(data)
      })

      .catch((error: unknown) => console.error(error))

    if (banderaUnicaVez) {
      setObjetivosFav([])
      console.log('Borre los objetivos favoritos para evitar errores?')
      setBanderaUnicaVez(false)
    }
  }, [])

  useEffect(() => {
    if (!session) return

    insigniaQuince(session)
      .then(data => console.log('insignia 15 ya estaba desbloqueada: ', data))
      .catch((error: unknown) => console.log(error))
  }, [session])

  return (
    <>
      <Helmet>
        <link
          rel='preload'
          fetchPriority='high'
          as='image'
          href='/CapyChill.webp'
          type='image/webp'
        />
      </Helmet>
      <section className='flex flex-col sm:gap-20 sm:p-6 md:flex-row'>
        <div className='mt-4 px-4 sm:px-4'>
          <DialogoChicho />
          <div className='relative flex max-h-[300px] w-full min-w-[290px] max-w-[340px] items-center justify-center overflow-hidden sm:h-full sm:max-h-[450px] sm:min-w-[450px] sm:max-w-[450px]'>
            <Reproductor src='/CapyNada' />
          </div>
        </div>
        {/* columna 2 */}
        <div className='p-2 sm:p-0'>
          <h1 className='text-4xl font-bold'>Hola!</h1>
          <p className='mt-2'>Elige tu método de estudio:</p>
          <ToggleGroup
            type='single'
            className='rounded-xl bg-primary/60 p-2 dark:bg-primary'
            onValueChange={value => setDescription(value as CapyMetodos)}
          >
            <ToggleGroupItem
              value='Capydoro'
              className='flex items-center justify-center gap-1'
            >
              <Timer size={20} />
              Capydoro
            </ToggleGroupItem>
            <ToggleGroupItem
              value='Capymetro'
              className='flex items-center justify-center gap-1'
            >
              <Hourglass size={20} />
              Capymetro
            </ToggleGroupItem>
          </ToggleGroup>
          {/* Agregar evento  */}
          {session && (
            <div className='flex h-auto w-1/2 items-center space-x-4'>
              <Eventos />
              <div className='mt-6'>
                <CapyInfo desc='Organiza tus sesiones de estudio con eventos y objetivos. Selecciona el evento, haz clic en "Aceptar", añade los objetivos de la sesión y ¡Controla tu progreso en las CapyEstadísticas!' />
              </div>
            </div>
          )}

          {/* Objetivos */}
          <div className='mt-4 rounded-xl bg-secondary/70 p-4 dark:bg-secondary/90'>
            {/* Aca si eligio sesion o evento va a ir */}
            {selectedEvent ? (
              <label htmlFor=''>
                Objetivos del evento: {selectedEvent.title}
              </label>
            ) : (
              <label htmlFor=''>Objetivos de sesión</label>
            )}

            <div className='mt-2 flex items-center gap-2'>
              <Input
                type='text'
                placeholder='Ingrese el objetivo'
                value={inputValue}
                onKeyDown={handleAdd}
                onChange={e => setInputValue(e.target.value)}
                className='input-placeholder rounded-md p-3'
                style={{
                  backgroundColor: 'hsl(var(--input-bg))',
                  border: `1px solid hsl(var(--input-border))`,
                }}
                disabled={objetivos.length >= 10}
              />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='justify-between'
                    disabled={objetivos.length >= 10}
                    onClick={() => {
                      recoverObjectives()
                    }}
                  >
                    {value ? (
                      objetivosFav.find(objetivoFav => objetivoFav === value)
                    ) : (
                      <Star className='' />
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='p-0'>
                  <Command>
                    <CommandInput placeholder='Seleccionar objetivo favorito...' />
                    <CommandList>
                      <CommandEmpty>No se encontró el objetivo.</CommandEmpty>
                      <CommandGroup>
                        {objetivosFav.map(objetivoFav => (
                          <CommandItem
                            key={objetivoFav}
                            value={objetivoFav}
                            onSelect={currentValue => {
                              setOpen(false)
                              setInputValue('')
                              if (
                                !objetivos.includes(currentValue) &&
                                objetivos.length < 10
                              )
                                setObjetivos([...objetivos, currentValue])
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                value === objetivoFav
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {objetivoFav}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className='mt-4'>
              <ul className='list-inside list-disc space-y-2 text-base text-black'>
                {objetivos.map((objetivo, key) => (
                  <li key={key} className='flex items-center justify-between'>
                    {index === key ? (
                      <div className='flex items-center gap-2'>
                        <Input
                          type='text'
                          defaultValue={objetivo}
                          onKeyDown={e => handleSaveEdit(e, key)}
                          className='rounded-md border border-secondary bg-white p-3 shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2'
                        />
                      </div>
                    ) : (
                      <div className='flex w-full items-center justify-between'>
                        <span>{objetivo}</span>
                        <div className='flex items-center'>
                          <TooltipProvider delayDuration={50}>
                            <Tooltip delayDuration={50}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='icon'
                                  size='icon'
                                  onClick={() => handleEdit(key)}
                                >
                                  {' '}
                                  <Edit3 size={20} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Modificar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider delayDuration={50}>
                            <Tooltip delayDuration={50}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='icon'
                                  size='icon'
                                  onClick={() => handleDelete(key)}
                                >
                                  <Trash size={20} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider delayDuration={50}>
                            <Tooltip delayDuration={50}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='icon'
                                  size='icon'
                                  onClick={() => handleFav(String(objetivo))}
                                >
                                  {objetivosFav.includes(String(objetivo)) ? (
                                    <StarOff
                                      size={20}
                                      style={{ color: '#ffbc05' }}
                                    />
                                  ) : (
                                    <Star
                                      size={20}
                                      className='text-black-500'
                                    />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Favorito</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {objetivos.length >= 10 && (
              <div>
                <p className='mt-2 text-red-500'>
                  Has alcanzado el límite de 10 objetivos.
                </p>
              </div>
            )}
          </div>
          <div className='mt-6 flex items-center justify-center'>
            {/* Motivación */}
            <Select
              onValueChange={value => handleSelect(value)}
              defaultValue={
                motivationPreference === '1' ? 'Positiva' : 'Pasivo Agresiva'
              }
            >
              <SelectTrigger className='ml-4 w-[280px]'>
                <SelectValue placeholder='Selecciona una motivación' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo de motivación</SelectLabel>
                  {motivaciones.map(motivacion => (
                    <SelectItem key={motivacion.id} value={motivacion.nombre}>
                      <p className='flex w-full items-center justify-between'>
                        {motivacion.nombre}
                      </p>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <CapyInfo desc='La motivación es un factor clave para el éxito en el estudio. Selecciona el tipo de mensajes que te ayude a mantenerte enfocado y motivado. ' />
          </div>
          {/* Musica */}
          <div className='mt-4'>
            {selectedPlaylist !== -1 ? (
              <div className='flex justify-between'>
                <h2 className='rounded-lg bg-accent p-2'>
                  Playlist seleccionada:{' '}
                  <span className='font-semibold text-accent-foreground'>
                    {playlists[selectedPlaylist - 1].title}
                  </span>
                </h2>
                <CapyInfo
                  desc='Haz click en la CapyPlaylist que más te guste para estudiar con música de fondo.
                Recuerde tener su cuenta de Spotify iniciada en el navegador'
                />
              </div>
            ) : (
              <div className='flex justify-between'>
                <h2 className='rounded-lg bg-accent p-2'>
                  Playlist seleccionada:{' '}
                  <span className='font-semibold text-accent-foreground'>
                    Sin música
                  </span>
                </h2>
                <CapyInfo
                  desc='Haz click en la CapyPlaylist que más te guste para estudiar con música de fondo.
                Recuerde tener su cuenta de Spotify iniciada en el navegador'
                />
              </div>
            )}

            <Carousel className='w-full max-w-md' opts={{ loop: true }}>
              <CarouselContent>
                {playlists.map(item => (
                  <CarouselItem
                    key={item.key}
                    className='cursor-pointer'
                    onClick={() => {
                      handleMusicSelection(
                        {
                          title: item.title,
                          spotifyUri: item.spotifyUri,
                        },
                        item.key
                      )
                      setSelectedPlaylist(prev =>
                        prev === item.key ? -1 : item.key
                      )
                    }}
                  >
                    <div className='p-1'>
                      <Card className='group relative h-48 w-full overflow-hidden'>
                        <CardContent className='p-0'>
                          <img
                            src={item.src}
                            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                            alt={item.alt}
                          />
                          <div className='absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                            <h3
                              className={`mb-2 text-lg font-bold ${selectedPlaylist === item.key ? 'text-xl text-accent' : 'text-white'}`}
                            >
                              {item.title}
                            </h3>
                            <p className='px-4 text-center text-sm text-white'>
                              {item.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='left-4' />
              <CarouselNext className='right-4' />
            </Carousel>
          </div>

          <div className='mt-5 flex justify-end space-x-4'>
            <Button
              type='submit'
              className='flex justify-end'
              onClick={handleAccept}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
