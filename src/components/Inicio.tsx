import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from './ui/button'


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

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
 
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
 
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
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
  const [value, setValue] = React.useState("")

  const [description, setDescription] =
    useState<keyof typeof descriptions>('Capydoro')

    const [, setLocation] = useLocation()

    const handleAccept = () => {
      if (description === 'Capydoro') {
        setLocation('/capydoro') 
      } else if (description === 'Capymetro') {
        setLocation('/capymetro') 
      }
    }

  const [objetivos, setObjetivos] = useState<string[]>([])

 
  
  // vacia
  /* const [value, setValue] = useState('') */

  const [objetivosFav, setObjetivosFav] = useState<string[]>([]) // vacia
  const [inputValue, setInputValue] = useState('')

  const [index, setIndex] = useState<number|null>(null) // hasta que se toque

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      setObjetivos([...objetivos, inputValue])
      setInputValue('')
    }
  }

  const handleDelete = (index: number) => {
    const auxObjetivos = objetivos.filter((_, i) => i !== index) //hola a los que no son
    setObjetivos(auxObjetivos)
    const auxObjetivosFav = objetivosFav.filter((_, i) => i !== index);
    setObjetivosFav(auxObjetivosFav)
  }
  
  const handleEdit = (index: number) => {
    setIndex(index)
  }

  const handleSaveEdit = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key == 'Enter'){
      const auxObjetivos = [...objetivos]
      auxObjetivos[index] = e.currentTarget.value.trim()
      setObjetivos(auxObjetivos)
      setIndex(null)
    }
  }

  const handleFav = (key) => {
    if (objetivosFav.includes(key)) {
      setObjetivosFav(objetivosFav.filter(favKey => favKey !== key));
    } else {
      setObjetivosFav([...objetivosFav, key]);
    }
  };
  


  return (
    <>
      <section className='flex flex-col gap-20 p-10 md:flex-row'>
        <div className='m-auto'>
          <img src='/idle.gif' />
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
              value='Capydpro'
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


          <div className='mt-4 rounded-xl bg-secondary/60 p-4'>
            <div className='flex items-center gap-2'>
              <Input
                  type='text'
                  placeholder='Ingrese el objetivo'
                  value={inputValue}
                  onKeyDown={handleAdd}
                  onChange={(e) => setInputValue(e.target.value)}
                  className='p-3 rounded-md border border-secondary bg-white shadow-md focus:outline-none focus:ring-2 hover:shadow-lg transition-shadow duration-200 ease-in-out'
              />
            </div>
            <div className='mt-4'>
              <ul className='list-inside list-disc text-black text-base space-y-2'>
                {objetivos.map((objetivo, key) => (
                  <li key={key} className='flex items-center justify-between'>
                    
                    {index === key? (
                      <div className='flex items-center gap-2'>
                        <Input 
                        type='text' 
                        defaultValue={objetivo}
                        onKeyDown={(e) => handleSaveEdit(e, key)}
                        className='p-3 rounded-md border border-secondary bg-white shadow-md focus:outline-none focus:ring-2 hover:shadow-lg transition-shadow duration-200 ease-in-out'
                        />
                      </div>) : ( 
                      <div className='flex w-full items-center justify-between'>
                          <span>{objetivo}</span>
                          <div className='flex items-center gap-2'>
                            <button onClick={() => handleEdit(key)}>
                              <Edit3 size={20} />
                            </button>
                            <button onClick={() => handleDelete(key)}>
                              <Trash size={20} />
                            </button>
                            <button onClick={() => handleFav(key)}>
                              {objetivosFav.includes(key) ? (
                                <StarOff size={20} style={{ color: '#ffbc05' }} />
                              ) : (
                                <Star size={20} className='text-black-500' />
                              )}
                            </button>
                          </div>
                        </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            type='submit'
            className='ml-auto mt-4 flex justify-end'
            
            onClick={handleAccept} 
          >
            Aceptar
          </Button>

          <div className='mt-4'>
            <p>{descriptions[description]}</p>
          </div>
        </div>
      </section>
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
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