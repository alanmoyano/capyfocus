import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { Calendar as CalendarIcon } from 'lucide-react'

import { format } from 'date-fns'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const now = new Date()

const formSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre es requerido'
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('El correo no es válido'),
  birthdate: z
    .date()
    .max(
      new Date(now.getFullYear() - 10, now.getMonth(), now.getDate()),
      'Debes tener al menos 10 años'
    ),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
})

function SignupForm() {
  const [date, setDate] = useState<Date>()
  const [month, setMonth] = useState<number>(now.getMonth())
  const [year, setYear] = useState<number>(now.getFullYear() - 10)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      birthdate: now,
      password: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
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
            //ignorar lo de abajo...
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
                    <Input placeholder='Chicho' {...field} />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='birthdate'
              render={() => (
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
                    </PopoverContent>
                  </Popover>
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
                    <Input type='password' placeholder='********' {...field} />
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