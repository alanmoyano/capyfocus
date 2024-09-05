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

export default function Inicio() {

  return (
    <>
      <section className='flex flex-col gap-20 p-10 md:flex-row'>
        <div className='m-auto'>
          <img src='/idle.gif' />
        </div>

        <div className='m-auto'>
          <h1 className='text-4xl font-bold'>Hola!</h1>
          <p>Elije tu método de estudio:</p>
          <ToggleGroup type='single' className='rounded-xl bg-primary/60 p-2'>
            <ToggleGroupItem value='Capydoro'>Capydoro</ToggleGroupItem>
            <ToggleGroupItem value='Capymetro'>Capymetro</ToggleGroupItem>
          </ToggleGroup>
          
          <div className='rounded-xl bg-secondary/60 p-4 mt-4'>

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
        </div>
      </section>
    </>
  )
}
