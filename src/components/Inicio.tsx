import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Button } from './ui/button'

import { Hourglass, Timer } from 'lucide-react'

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


type CapyMetodos = 'Capydoro' | 'Capymetro'

const descriptions: Record<CapyMetodos, string> = {
  Capydoro: 'Estudia con el método Pomodoro',
  Capymetro: 'Estudia con un cronómetro'
}

export default function Inicio() {
  const [description, setDescription] =
    useState<keyof typeof descriptions>('Capydoro')

  return (
    <>
      <section className='flex flex-col gap-20 p-10 md:flex-row'>
        <div className='m-auto'>
          <img src='/idle.gif' />
          <Select>
            <SelectTrigger className='w-[280px] ml-4'>
              <SelectValue placeholder='Selecciona una motivación' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo de motivación</SelectLabel>
                <SelectItem value='positiva'>Positiva</SelectItem>
                <SelectItem value='pasivoAgresiva'>Pasivo/Agresiva</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='m-auto'>
          <h1 className='text-4xl font-bold'>Hola!</h1>
          <p>Elije tu método de estudio:</p>
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

          <div className='mt-4 rounded-xl bg-secondary/60 p-4'>
            <Carousel
              className='w-full max-w-xs'
              opts={{
                align: 'start',
                loop: true
              }}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className='p-1'>
                    <Card>
                      <CardContent className='flex aspect-square items-center justify-center p-2'>
                        <span className='text-4xl font-semibold'>
                          <Hourglass size={96} className='' />
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className='p-1'>
                    <Card>
                      <CardContent className='flex aspect-square items-center justify-center p-2'>
                        <span className='text-4xl font-semibold'>
                          <Timer size={96} className='' />
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>

              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <Button
              type='submit'
              className='ml-auto mt-4 flex justify-end'
              form='form'
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
