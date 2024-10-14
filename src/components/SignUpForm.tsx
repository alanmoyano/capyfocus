import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Calendar as CalendarIcon, Eye, EyeOff } from 'lucide-react'

import { format } from 'date-fns'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { supabase } from './supabase/client'

const now = new Date()

const formSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre es requerido',
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('El correo no es válido'),
  birthdate: z
    .date()
    .min(new Date(now.getFullYear() - 100))
    .max(
      new Date(now.getFullYear() - 10, now.getMonth(), now.getDate()),
      'Debes tener al menos 10 años'
    ),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

function SignupForm() {
  const [date, setDate] = useState<Date>()
  const [month, setMonth] = useState<number>(now.getMonth())
  const [year, setYear] = useState<number>(now.getFullYear() - 10)
  const [isOpen, setIsOpen] = useState(false)
  const [verContraseña, setVerContraseña] = useState(false)

  const handlePassword = () => {
    setVerContraseña(!verContraseña)
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      birthdate: now,
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    async function signUp() {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            birthdate: values.birthdate,
          },
        },
      })
      console.log(data)
      if (error) console.error(error)
    }
    signUp().catch((error: unknown) => {
      console.error(error)
    })
  }

  return (
    <Card className='h-auto'>
      <CardHeader>
        <CardTitle>Registrarse</CardTitle>
        <CardDescription>Ingresa tus datos para registrarte.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            // eslint-disable-next-line
            onSubmit={form.handleSubmit(onSubmit)}
            id='signUp'
            className='flex flex-col gap-2'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Chicho'
                      className='dark:placeholder:text-gray-500'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='mail'>Correo</FormLabel>
                  <FormControl>
                    <Input
                      id='mail'
                      type='mail'
                      placeholder='chicho@capymail.com'
                      {...field}
                      className='dark:placeholder:text-gray-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='birthdate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de nacimiento</FormLabel>
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                          format(date, 'PPP', { locale: es })
                        ) : (
                          <span className='text-gray-500 hover:text-black'>
                            Elige una fecha
                          </span>
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
                                {format(new Date(0, i), 'MMMM', { locale: es })}
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
                                value={(now.getFullYear() - 99 + i).toString()}
                              >
                                {now.getFullYear() - 99 + i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormControl>
                        <Calendar
                          mode='single'
                          selected={date}
                          onSelect={newDate => {
                            setDate(newDate)
                            field.onChange(newDate)
                          }}
                          month={new Date(year, month, now.getDate())}
                          onMonthChange={newMonth => {
                            setMonth(newMonth.getMonth())
                            setYear(newMonth.getFullYear())
                          }}
                          initialFocus
                          onDayClick={date => {
                            setIsOpen(false)
                            setMonth(date.getMonth())
                            setYear(date.getFullYear())
                          }}
                          locale={es}
                          toYear={now.getFullYear() - 10}
                          disabled={date =>
                            date >
                            new Date(
                              now.getFullYear() - 10,
                              now.getMonth(),
                              now.getDate()
                            )
                          }
                        />
                      </FormControl>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Debes tener al menos 10 años para crear una capyCuenta
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <div className='flex justify-between'>
                      <Input
                        id='contraseña'
                        placeholder='********'
                        type={verContraseña ? 'text' : 'password'}
                        className='dark:placeholder:text-gray-500'
                        {...field}
                      />
                      <Button
                        variant={'icon'}
                        type='button'
                        onClick={handlePassword}
                      >
                        {verContraseña ? <EyeOff></EyeOff> : <Eye></Eye>}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button className='w-1/2' form='signUp' type='submit'>
          Guardar
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SignupForm
