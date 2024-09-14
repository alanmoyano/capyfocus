import { KeyboardEvent, useState } from 'react'

import { useLocation } from 'wouter'

import * as React from 'react'

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
import { useObjetivos } from './ObjetivosContext'
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
//import { useMotivation } from './MotivationContext'

type CapyMetodos = 'Capydoro' | 'Capymetro'

const descriptions: Record<CapyMetodos, string> = {
  Capydoro: 'Estudia con el método Pomodoro',
  Capymetro: 'Estudia con un cronómetro'
}

/* Evento */
type Event = {
  date: Date
  title: string
}

export default function Inicio() {
  const [open, setOpen] = useState(false)
  const [value] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [inputValue, setInputValue] = useState('')
  const [index, setIndex] = useState<number | null>(null)

  const { objetivos, setObjetivos, objetivosFav, setObjetivosFav } =
    useObjetivos()

  const [description, setDescription] =
    useState<keyof typeof descriptions>('Capydoro')

  const [, setLocation] = useLocation()

  //const [, setMotivationType] = useMotivation()

  const handleAccept = () => {
    if (description === 'Capydoro') {
      setLocation('/capydoro')
    } else {
      setLocation('/capymetro')
    }
  }

  const handleVolver = () => {
    setLocation('/')
  }

  const handleSelect = (value: string) => {
    console.log(value)

    //setMotivationType(value)
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

  /* const [date, setDate] = React.useState<Date | undefined>(new Date()) */
  const [events, setEvents] = React.useState<Event[]>([])
  const [eventTitle, setEventTitle] = React.useState<string>('')

  const addEvent = () => {
    if (date && eventTitle) {
      setEvents([...events, { date, title: eventTitle }])
      setEventTitle('') // Limpiar el título después de añadir el evento
    }
  }

  return (
    <>
      <section className='flex flex-col gap-20 p-10 md:flex-row'>
        <div className='m-auto'>
          <img src='/idle.gif' />
          {/* Motivación */}
          <Select onValueChange={value => handleSelect(value)}>
            <SelectTrigger className='ml-4 w-[280px]'>
              <SelectValue placeholder='Selecciona una motivación' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo de motivación</SelectLabel>
                <SelectItem key={0} value='positiva'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p>Positiva</p>
                      </TooltipTrigger>
                      <TooltipContent className='ml-16'>
                        <p>Mensajes positivos</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SelectItem>
                <SelectItem key={1} value='pasivoAgresiva'>
                  <TooltipProvider>
                    <Tooltip>
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
              <Button variant='secondary' className='mt-6 bg-secondary'>
                Eventos
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Agrega evento</SheetTitle>
                <SheetDescription>Agrega eventos desde aqui.</SheetDescription>
              </SheetHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Nombre
                  </Label>
                  <Input
                    id='name'
                    type='text'
                    value={eventTitle}
                    onChange={e => setEventTitle(e.target.value)}
                    placeholder='Evento'
                    className='col-span-3'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    Calendario
                  </Label>
                </div>
                {/* Calendario */}

                <div>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    className='flex w-full justify-center rounded-md border'
                    modifiers={{
                      eventDay: events.map(event => event.date)
                    }}
                    modifiersClassNames={{
                      eventDay: 'bg-secondary' // Estilo para días con eventos
                    }}
                    locale={es}
                    components={{
                      DayContent: ({ date }) => {
                        const event = events.find(
                          e => e.date.toDateString() === date.toDateString()
                        )
                        return (
                          <TooltipProvider>
                            <Tooltip>
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
                        )
                      }
                    }}
                  />

                  <div className='mt-4'>
                    <Button onClick={addEvent}>Agregar</Button>
                  </div>
                  <div className='mt-4'>
                    <h2>Eventos:</h2>
                    <ul>
                      {events.map((event, index) => (
                        <li key={index}>
                          {event.date.toLocaleDateString('es-ES', {
                            weekday: 'short',
                            month: 'numeric',
                            day: 'numeric'
                          })}
                          - {event.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant={'accent'} onClick={() => handleVolver()}>
                    Volver
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {/* Objetivos */}
          <div className='mt-4 rounded-xl bg-secondary/60 p-4'>
            <div className='flex items-center gap-2'>
              <Input
                type='text'
                placeholder='Ingrese el objetivo'
                value={inputValue}
                onKeyDown={handleAdd}
                onChange={e => setInputValue(e.target.value)}
                className='rounded-md border border-secondary bg-white p-3 shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2'
              />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='justify-between'
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
                              // setValue(currentValue === value ? '' : currentValue)
                              setOpen(false)
                              setInputValue('')
                              if (!objetivos.includes(currentValue))
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
                          <TooltipProvider>
                            <Tooltip>
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

                          <TooltipProvider>
                            <Tooltip>
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

                          <TooltipProvider>
                            <Tooltip>
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
          </div>

          <p className='mt-4 text-xl font-bold'>Musica para la sesion</p>
          <div className='flex items-center justify-center'>
            <Carousel className='w-2/3 max-w-xs' opts={{ loop: true }}>
              <CarouselContent>
                <CarouselItem key={1}>
                  <div className='p-1'>
                    <Card className='group relative h-full w-full'>
                      <CardContent className='p-0'>
                        <img
                          src='./CapyChill.png'
                          className='h-full w-full object-cover'
                          alt='CapyChill'
                        />
                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                          <p className='p-2 text-center text-white'>
                            Música relajante para estudiar con tranquilidad
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <p className='mt-2 text-center text-sm'>Capy Chill</p>
                  </div>
                </CarouselItem>

                <CarouselItem key={2}>
                  <div className='p-1'>
                    <Card className='group relative h-full w-full'>
                      <CardContent className='p-0'>
                        <img
                          src='./CapyAmbiente.png'
                          className='h-full w-full object-cover'
                          alt='CapyAmbiente'
                        />
                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                          <p className='p-2 text-center text-white'>
                            Sonidos ambientales para mejorar la concentración
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <p className='mt-2 text-center text-sm'>Capy Ambiente</p>
                  </div>
                </CarouselItem>

                <CarouselItem key={3}>
                  <div className='p-1'>
                    <Card className='group relative h-full w-full'>
                      <CardContent className='p-0'>
                        <img
                          src='./CapySinthwave.png'
                          className='h-full w-full object-cover'
                          alt='CapySinthwave'
                        />
                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                          <p className='p-2 text-center text-white'>
                            Música electrónica retro para un estudio energético
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <p className='mt-2 text-center text-sm'>Capy Sinthwave</p>
                  </div>
                </CarouselItem>

                <CarouselItem key={4}>
                  <div className='p-1'>
                    <Card className='group relative h-full w-full'>
                      <CardContent className='p-0'>
                        <img
                          src='./CapyEpic.png'
                          className='h-full w-full object-cover'
                          alt='CapyEpic'
                        />
                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                          <p className='p-2 text-center text-white'>
                            Música épica para momentos de máxima concentración
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <p className='mt-2 text-center text-sm'>Capy Epic</p>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
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
          <div className='mt-4'>
            <p>{descriptions[description]}</p>
          </div>
        </div>
      </section>
    </>
  )
}
