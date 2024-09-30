import { KeyboardEvent, useEffect, useState } from 'react'

import { useLocation } from 'wouter'

import { es } from 'date-fns/locale'

import {
  Edit3,
  Hourglass,
  Star,
  Timer,
  Trash,
  StarOff,
  Check,
  ChevronsUpDown
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { useObjetivos } from './contexts/ObjetivosContext'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { Button } from './ui/button'

import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { Calendar } from '@/components/ui/calendar'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { useMotivation } from './contexts/MotivationContext'

import { useMusic } from './contexts/MusicContext'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useSesion } from '@/components/contexts/SesionContext'

import DialogoChicho from './ComponentesEspecifico/DialogoChicho'

type CapyMetodos = 'Capydoro' | 'Capymetro' | ''

const descriptions: Record<CapyMetodos, string> = {
  Capydoro: 'Estudia con el método Pomodoro',
  Capymetro: 'Estudia con un cronómetro',
  '': ''
}

/* Evento */
type Event = {
  date: Date
  title: string
}

const playlists = [
  {
    key: 1,
    src: './CapyChill.jpg',
    alt: 'CapyChill',
    title: 'Capy Chill',
    description: 'Música relajante para estudiar con tranquilidad',
    spotifyUri: '7u6QwhygZJJqqGWMMMINhR'
  },
  {
    key: 2,
    src: './CapyAmbiente.jpg',
    alt: 'CapyAmbiente',
    title: 'Capy Ambiente',
    description: 'Sonidos ambientales para mejorar la concentración',
    spotifyUri: '4Pi6DScPJfg1RTGVZuxTZV'
  },
  {
    key: 3,
    src: './CapySinthwave.jpg',
    alt: 'CapySinthwave',
    title: 'Capy Sinthwave',
    description: 'Música electrónica retro para un estudio energético',
    spotifyUri: '6xYhxczmfgi6L6knoEHktx'
  },
  {
    key: 4,
    src: './CapyEpic.jpg',
    alt: 'CapyEpic',
    title: 'Capy Epic',
    description: 'Música épica para momentos de máxima concentración',
    spotifyUri: '5GnSqO293GdPWaJhD6iz8E'
  }
  // {
  //   key: 5,
  //   src: './NoCapyMusic.png',
  //   alt: 'NoCapyMusic',
  //   title: 'Sin Musica',
  //   description:
  //     'Reproduce tu propia musica'
  // }
]

export default function Inicio() {
  const [open, setOpen] = useState(false)
  const [value] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [inputValue, setInputValue] = useState('')
  const [index, setIndex] = useState<number | null>(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState(-1)

  const { objetivos, setObjetivos, objetivosFav, setObjetivosFav } =
    useObjetivos()

  const [description, setDescription] = useState<CapyMetodos>('')

  const [, setLocation] = useLocation()

  const { setMotivationType } = useMotivation()

  const { setSelectedMusic } = useMusic()

  const [events, setEvents] = useState<Event[]>([])
  const [eventTitle, setEventTitle] = useState<string>('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const { setTecnicaEstudio } = useSesion()

  const handleAccept = () => {
    switch (description) {
      case 'Capydoro':
        setLocation('/capydoro')
        setTecnicaEstudio(description)
        break
      case 'Capymetro':
        setLocation('capymetro')
        setTecnicaEstudio(description)
        break
    }
  }

  const handleVolver = () => {
    setLocation('/')
  }

  const handleSelect = (value: string) => {
    console.log(value)

    setMotivationType(value)
  }

  const handleAdd = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key == 'Enter' &&
      inputValue.trim() != '' &&
      !objetivos.includes(inputValue)
    ) {
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
    } else {
      setObjetivosFav([...objetivosFav, objetivo])
    }
  }

  /* Evento */

  /* const [date, setDate] = useState<Date | undefined>(new Date()) */

  const addEvent = () => {
    if (date && eventTitle) {
      setEvents([...events, { date, title: eventTitle }])
      setEventTitle('') // Limpiar el título después de añadir el evento
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
    setSelectedMusic(null)
  }, [])

  return (
    <>
      <section className='mt-10 flex flex-col gap-20 p-10 md:flex-row'>
        <div className=''>
          <DialogoChicho dialogo={descriptions[description]} />
          <video src='/idle.webm' autoPlay loop muted playsInline />
        </div>

        <div className='m-auto'>
          <h1 className='text-4xl font-bold'>Hola!</h1>
          <p>Elige tu método de estudio:</p>
          <ToggleGroup
            type='single'
            className='rounded-xl bg-primary/60 p-2'
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
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='secondary'
                className='mt-6 w-full bg-secondary sm:w-auto'
              >
                Eventos
              </Button>
            </SheetTrigger>
            <SheetContent className='w-full sm:max-w-md'>
              <ScrollArea className='h-[80vh] pr-4'>
                <SheetHeader>
                  <SheetTitle className='text-xl font-bold sm:text-2xl'>
                    Agregar evento
                  </SheetTitle>
                  <SheetDescription className='text-lg text-black sm:text-xl'>
                    Agrega eventos desde aquí.
                  </SheetDescription>
                </SheetHeader>
                <p className='mt-2 text-sm text-muted-foreground'>
                  ¿Cual es el evento?
                </p>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-1 items-center gap-4 sm:grid-cols-4'>
                    <Label
                      htmlFor='name'
                      className='text-sm font-bold sm:text-right sm:text-base'
                    >
                      Nombre
                    </Label>
                    <Input
                      id='name'
                      type='text'
                      value={eventTitle}
                      onChange={e => setEventTitle(e.target.value)}
                      placeholder='Evento'
                      className='col-span-1 sm:col-span-3'
                    />
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Selecciona una fecha para el evento.
                  </p>
                  <div className='grid grid-cols-1 items-center gap-4 sm:grid-cols-4'>
                    <Label className='text-sm font-bold sm:text-right sm:text-base'>
                      Calendario
                    </Label>
                  </div>
                  {/* Calendario */}

                  <div className='w-full sm:w-auto'>

                    
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={selectedDate => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        if (selectedDate && selectedDate >= today) {
                          setDate(selectedDate)
                        }
                      }}
                      className='flex w-full justify-center rounded-md border sm:w-auto'
                      modifiers={{
                        eventDay: events.map(event => event.date),
                        disabled: date => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today
                        }
                      }}
                      modifiersClassNames={{
                        eventDay: 'bg-secondary',
                        disabled: 'opacity-50 cursor-not-allowed'
                      }}
                      locale={es}
                      onDayClick={(day: Date) => {
                        const clickedEvent = events.find(
                          event =>
                            event.date.toDateString() === day.toDateString()
                        )
                        setSelectedEvent(clickedEvent ?? null)
                      }}
                      components={{
                        DayContent: ({ date }) => {
                          const event = events.find(
                            e => e.date.toDateString() === date.toDateString()
                          )
                          return (
                            <div>
                              <TooltipProvider delayDuration={50}>
                                <Tooltip delayDuration={50}>
                                  <TooltipTrigger asChild>
                                    <div>{date.getDate()}</div>
                                  </TooltipTrigger>
                                  {event && (
                                    <TooltipContent>
                                      <p>{event.title}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )
                        }
                      }}
                    />

                    <div className='mt-4'>
                      <Button
                        onClick={addEvent}
                        variant={'accent'}
                        className='w-full sm:w-auto'
                      >
                        Agregar
                      </Button>
                    </div>
                    <hr className='my-4' />
                    <div className='mt-4'>
                      <p className='text-sm text-muted-foreground'>
                        Selecciona el evento para agregar objetivos de sesión:
                      </p>
                      <h1 className='mt-2 border-b-2 text-xl font-bold text-sky-800 sm:text-2xl'>
                        Información de eventos:
                      </h1>
                      <h2 className='text-lg font-bold sm:text-xl'>
                        Eventos programados:
                      </h2>
                      <ul className='list-inside list-disc space-y-2 text-sm text-black sm:text-base'>
                        {events.map((event, index) => (
                          <li
                            key={index}
                            className='flex items-center justify-between'
                          >
                            <span
                              onClick={() => setSelectedEvent(event)}
                              className={`cursor-pointer ${
                                selectedEvent === event
                                  ? 'text-primary'
                                  : 'hover:text-primary'
                              }`}
                            >
                              {event.date.toLocaleDateString('es-ES', {
                                weekday: 'short',
                                month: 'numeric',
                                day: 'numeric'
                              })}
                              - {event.title}
                            </span>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                setEvents(events.filter((_, i) => i !== index))
                                if (selectedEvent === event) {
                                  setSelectedEvent(null)
                                }
                              }}
                            >
                              <Trash size={16} />
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <h2 className='mt-4 text-lg font-bold sm:text-xl'>
                        Evento seleccionado:
                      </h2>
                      {selectedEvent ? (
                        <div className='mt-2'>
                          <p className='font-bold'>
                            Evento:{' '}
                            <span className='font-normal'>
                              {selectedEvent.title}
                            </span>
                          </p>
                          <p>
                            Fecha:{' '}
                            {selectedEvent.date.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      ) : (
                        <p>Ningún evento seleccionado</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <SheetFooter className='flex w-full justify-between'>
                <SheetClose asChild>
                  <div className='flex w-full justify-between'>
                    <Button
                      variant={'accent'}
                      className='w-full sm:mr-2 sm:w-auto'
                      onClick={() => {
                        handleVolver()
                        setSelectedEvent(null)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant={'secondary'}
                      className='w-full sm:ml-2 sm:w-auto'
                      onClick={() => {
                        handleVolver()
                      }}
                    >
                      Aceptar
                    </Button>
                  </div>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {/* Objetivos */}
          <div className='mt-4 rounded-xl bg-secondary/60 p-4'>
            {selectedEvent ? (
              <p className='font-bold'>
                Evento:{' '}
                <span className='font-normal'>{selectedEvent.title}</span>
              </p>
            ) : (
              <p></p>
            )}
            <div className='mt-2 flex items-center gap-2'>
              <Input
                type='text'
                placeholder='Ingrese el objetivo'
                value={inputValue}
                onKeyDown={handleAdd}
                onChange={e => setInputValue(e.target.value)}
                className='rounded-md border border-secondary bg-white p-3 shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2'
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
                  >
                    {value ? (
                      objetivosFav.find(objetivoFav => objetivoFav === value)
                    ) : (
                      <Star />
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
              <p className='mt-2 text-red-500'>
                Has alcanzado el límite de 10 objetivos.
              </p>
            )}
          </div>
          <div className='mt-6 flex items-center justify-center'>
            {/* Motivación */}
            <Select onValueChange={value => handleSelect(value)}>
              <SelectTrigger className='ml-4 w-[280px]'>
                <SelectValue placeholder='Selecciona una motivación' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo de motivación</SelectLabel>
                  <SelectItem key={0} value='Positiva'>
                    <TooltipProvider delayDuration={50}>
                      <Tooltip delayDuration={50}>
                        <TooltipTrigger asChild>
                          <p>Positiva</p>
                        </TooltipTrigger>
                        <TooltipContent className='ml-16'>
                          <p>Mensajes positivos</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SelectItem>
                  <SelectItem key={1} value='PasivoAgresiva'>
                    <TooltipProvider delayDuration={50}>
                      <Tooltip delayDuration={50}>
                        <TooltipTrigger asChild>
                          <p>Pasivo/Agresivo</p>
                        </TooltipTrigger>
                        <TooltipContent className='ml-16'>
                          <p>Mensajes pasivos/agresivos</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Musica */}
          <div className='mt-4'>
            {selectedPlaylist !== -1 && (
              <div className='rounded-lg bg-accent p-2'>
                <h2>
                  Playlist seleccionada:{' '}
                  <span className='font-semibold text-accent-foreground'>
                    {playlists[selectedPlaylist - 1].title}
                  </span>
                </h2>
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
                          spotifyUri: item.spotifyUri
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
              <CarouselPrevious className='-left-8' />
              <CarouselNext className='-right-8' />
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
