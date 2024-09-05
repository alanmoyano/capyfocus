import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from './ui/button'
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { Hourglass, Timer, Trash, Edit3, Star } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'


import { useState } from 'react'

import { useLocation } from 'wouter'

type CapyMetodos = 'Capydoro' | 'Capymetro'

const descriptions: Record<CapyMetodos, string> = {
  Capydoro: 'Estudia con el método Pomodoro',
  Capymetro: 'Estudia con un cronómetro'
}

export default function Inicio() {
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
  const [objetivosFav, setObjetivosFav] = useState<string[]>([]) // vacia
  const [value, setValue] = useState('')
  const [index, setIndex] = useState<number|null>(null) // hasta que se toque

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      setObjetivos([...objetivos, value])
      setValue('')
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

  const handleFav = (index: number) => {
    const objetivo = objetivos[index]
    if (objetivosFav.includes(objetivo)) {
      setObjetivosFav(prev => prev.filter(objetivoFav => objetivoFav !== objetivo))
    } else {
      setObjetivosFav(prev => [...prev, objetivo]);  // agregarlo al combobox cuando lo instale
    }
  }

  // estilo estrella!

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
              <Input type='objetivo' placeholder='Ingrese el objetivo' value={value} onKeyDown={handleAdd} onChange={(e) => setValue(e.target.value)}
                     className='w-60 p-2 rounded border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <ul className='list-inside list-disc'>
              {objetivos.map((objetivo, key) => (
                <li key={key} className='flex items.center gap-2 mb-2'>
                  {index === key? (
                    <Input type='text' defaultValue={objetivo}
                    onKeyDown={(e) => handleSaveEdit(e, key)}
                    className='w-40 p-2 rounded border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                  ) : ( // sino veo los botones
                    <>
                    <span>{objetivo}</span>
                    <button onClick={() => handleEdit(key)}>
                      <Edit3 size={20}/>
                    </button>
                    <button onClick={()=> handleDelete(key)}>
                      <Trash size={20} />
                    </button>
                    <button onClick={() => handleFav(key)}>
                      <Star size={20}/> 
                    </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
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
    </>
  )
}
