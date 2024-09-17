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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Login() {
  const [date, setDate] = React.useState<Date>()
  const [month, setMonth] = React.useState<number>(new Date().getMonth())
  const [year, setYear] = React.useState<number>(new Date().getFullYear())
  return (
    <section className='mt-4 flex h-full w-[80vw] items-center justify-center rounded-[10rem] bg-secondary/60 p-4 text-current md:h-[90vh]'>
      <div className='xl:gap-30 flex flex-col p-10 sm:gap-10 md:flex-row lg:gap-20 2xl:gap-40'>
        <div className='m-auto w-full max-w-[300px] md:max-w-[366px]'>
          <img
            src='/girando.gif'
            className='aspect-[366/301] h-auto w-full object-contain'
            alt='capybara animation'
          />
        </div>

        <div className='m-auto w-full max-w-[400px] px-4 sm:px-0'>
          <div className='mb-4 mt-2'>
            <Tabs defaultValue='account' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='account'>Ingrese</TabsTrigger>
                <TabsTrigger value='password'>Registrarse</TabsTrigger>
              </TabsList>
              <TabsContent value='account'>
                <Card className='h-auto sm:h-[550px]'>
                  <CardHeader>
                    <CardTitle className='mt-8 sm:mt-16'>
                      Inicie Sesión
                    </CardTitle>
                    <CardDescription>
                      Bienvenido de vuelta, ingresa tus datos para iniciar
                      sesión.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div className='space-y-1'>
                      <Label htmlFor='username' className='font-medium'>
                        Usuario
                      </Label>
                      <Input placeholder='Chicho' type='text' />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='contraseña' className='font-medium'>
                        Contraseña
                      </Label>
                      <Input
                        id='contraseña'
                        placeholder='*****'
                        type='password'
                      />
                    </div>
                    <Label>¿Olvidaste tu contraseña?</Label>
                    <Button
                      variant={'link'}
                      className='border-none text-sm font-normal'
                    >
                      Recuperar
                    </Button>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-1/2'>Iniciar</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value='password'>
                <Card className='h-auto sm:h-[550px]'>
                  <CardHeader>
                    <CardTitle>Registrarse</CardTitle>
                    <CardDescription>
                      Ingresa tus datos para registrarte.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div className='space-y-1'>
                      <Label htmlFor='current'>Nombre</Label>
                      <Input id='current' type='name' placeholder='Chicho' />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='new'>Correo</Label>
                      <Input
                        id='new'
                        type='mail'
                        placeholder='chicho@capymail.com'
                      />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='new'>Fecha de nacimiento</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !date && 'text-black'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {date ? (
                              format(date, 'PPP')
                            ) : (
                              <span>Elige una fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <div className='flex justify-between p-2'>
                            <Select
                              value={month.toString()}
                              onValueChange={value => setMonth(parseInt(value))}
                            >
                              <SelectTrigger className='w-[120px]'>
                                <SelectValue placeholder='Month' />
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
                              onValueChange={value => setYear(parseInt(value))}
                            >
                              <SelectTrigger className='w-[120px]'>
                                <SelectValue placeholder='Year' />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 100 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={(year - 99 + i).toString()}
                                  >
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
                            onMonthChange={newMonth => {
                              setMonth(newMonth.getMonth())
                              setYear(newMonth.getFullYear())
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='new'>Contraseña</Label>
                      <Input id='new' type='password' placeholder='*****' />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='new'>Confirmar contraseña</Label>
                      <Input id='new' type='password' placeholder='*****' />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-1/2'>Guardar</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}
