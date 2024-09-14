import { Link } from 'wouter'
import { Button } from './ui/button'
import { Input } from './ui/input'
import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SignUp() {
  const [date, setDate] = React.useState<Date>();
  const [month, setMonth] = React.useState<number>(new Date().getMonth());
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  return (
    <>
      <section className='flex h-full w-[80vw] items-center justify-center rounded-[10rem] bg-secondary p-4 text-current md:h-[70vh]'>
        <div className='xl:gap-30 flex flex-col p-10 sm:gap-10 md:flex-row lg:gap-20 2xl:gap-40'>
          <div className='m-auto'>
            <img
              src='/girando.gif'
              width={412}
              height={395}
              className='aspect-[366/301]'
            />
          </div>

          <div className='m-auto'>
            <div className='mb-4 mt-2'>
              <h1 className='mx-1 text-pretty text-center text-2xl font-bold md:text-3xl lg:text-4xl'>
                Regístrate
              </h1>
              <p className='ml-1 text-pretty text-center text-lg text-muted'>
                Ingrese sus credenciales para continuar
              </p>
            </div>

            <form
              className='flex flex-col gap-4'
              // onSubmit={(e) => e.preventDefault()}
              action='https://google.com'
              autoComplete='off'
              id='form'
            >
              <div className='flex flex-row gap-2'>
                <div className='flex flex-col'>
                  <label>Nombre</label>
                  <Input placeholder='Brenda' type='text' />
                </div>

                <div className='flex flex-col'>
                  <label>Apellido</label>
                  <Input placeholder='Tapari' type='text' />
                </div>
              </div>

              <div className='flex flex-col'>
                <label>Correo</label>
                <Input placeholder='breightend@gmail.com' type='text' />
              </div>
  
              <div className='flex flex-col'>
                <label>Fecha de nacimiento</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <div className="flex justify-between p-2">
                      <Select
                        value={month.toString()}
                        onValueChange={(value) => setMonth(parseInt(value))}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {format(new Date(0, i), 'MMMM')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={year.toString()}
                        onValueChange={(value) => setYear(parseInt(value))}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 100 }, (_, i) => (
                            <SelectItem key={i} value={(year - 99 + i).toString()}>
                              {year - 99 + i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={setDate}
                      month={new Date(year, month)}
                      onMonthChange={(newMonth) => {
                        setMonth(newMonth.getMonth());
                        setYear(newMonth.getFullYear());
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className='flex flex-col'>
                <label>Contraseña</label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter password'
                />
              </div>

              <div className='flex flex-col'>
                <label>Confirmar contraseña</label>
                <Input
                  id='passwordConfirmation'
                  type='password'
                  placeholder='Enter password'
                />
              </div>
            </form>

            <p className='ml-2 mt-1 text-muted'>
              Ya tienes una cuenta?{' '}
              <Link
                to='/login'
                className='text-text rounded-lg px-1 font-semibold transition-all duration-200 hover:bg-primary/50'
              >
                inicia sesión aquí
              </Link>
            </p>
            <Button
              type='submit'
              form='form'
              className='text-cream ml-auto mt-4 flex justify-end'
            >
              Registrarme
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
