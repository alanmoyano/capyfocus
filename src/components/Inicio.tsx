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

import { Edit3, Hourglass, Star, Timer, Trash, StarOff } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

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

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js'
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit'
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js'
  },
  {
    value: 'remix',
    label: 'Remix'
  },
  {
    value: 'astro',
    label: 'Astro'
  }
]

import { useState } from 'react'

import { useLocation } from 'wouter'

type CapyMetodos = 'Capydoro' | 'Capymetro'

const descriptions: Record<CapyMetodos, string> = {
  Capydoro: 'Estudia con el método Pomodoro',
  Capymetro: 'Estudia con un cronómetro'
}

export default function Inicio() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [inputValue, setInputValue] = useState('')
  const [index, setIndex] = useState<number | null>(null)

  const { objetivos, setObjetivos, objetivosFav, setObjetivosFav } =
    useObjetivos()

  const [description, setDescription] =
    useState<keyof typeof descriptions>('Capydoro')

  const [, setLocation] = useLocation()

  const handleAccept = () => {
    if (description === 'Capydoro') {
      setLocation('/capydoro')
    } else {
      setLocation('/capymetro')
    }
  }

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter' && inputValue.trim() != '') {
      setObjetivos([...objetivos, inputValue])
      setInputValue('')
    }
  }

  const handleDelete = (index: number) => {
    const auxObjetivos = objetivos.filter((_, i) => i !== index) //hola a los que no son
    setObjetivos(auxObjetivos)
    const auxObjetivosFav = objetivosFav.filter((_, i) => i !== index)
    setObjetivosFav(auxObjetivosFav)
  }

  const handleEdit = (index: number) => {
    setIndex(index)
  }

  const handleSaveEdit = (
    e: React.KeyboardEvent<HTMLInputElement>,
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

  return (
    <>
      <section className='flex flex-col gap-20 p-10 md:flex-row'>
        <div className='m-auto'>
          <img src='/idle.gif' />
          {/* Motivación */}
          <Select>
            <SelectTrigger className='ml-4 w-[280px]'>
              <SelectValue placeholder='Selecciona una motivación' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo de motivación</SelectLabel>
                <SelectItem value='positiva'>
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
                <SelectItem value='pasivoAgresiva'>
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
                + Evento
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
                  <Input id='name' type='text' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    Calendario
                  </Label>
                </div>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  className='rounded-md border'
                />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type='submit'>Guardar</Button>
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-[200px] justify-between'
          >
            {value
              ? frameworks.find(framework => framework.value === value)?.label
              : 'Select framework...'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandInput placeholder='Search framework...' />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map(framework => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={currentValue => {
                      setValue(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === framework.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
