import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import PasswordRecovery from './ComponentesEspecifico/PasswordRecovery'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from './supabase/client'
import { useSession } from './contexts/SessionContext'
import { useLocation } from 'wouter'

const formSchema = z.object({
  email: z.string().min(2),
  password: z.string().min(8),
})

export default function LoginForm() {
  const [verContraseña, setVerContraseña] = useState(false)
  const { setSession } = useSession()
  const setLocation = useLocation()[1]

  const handlePassword = () => {
    setVerContraseña(!verContraseña)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    async function logIn() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (error) console.error(error)
      if (data.session) setSession(data.session)
      console.log(data)
    }
    logIn()
      .then(() => setLocation('/usuario'))
      .catch((error: unknown) => {
        console.error(error)
      })
  }

  return (
    <Card className='h-auto'>
      <CardHeader>
        <CardTitle>Inicie Sesión</CardTitle>
        <CardDescription>
          Bienvenido de vuelta, ingresa tus datos para iniciar sesión.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Form {...form}>
          <form
            // eslint-disable-next-line
            onSubmit={form.handleSubmit(onSubmit)}
            id='login'
            className='flex flex-col gap-2'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='email'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='chicho@capymail.com'
                      className='dark:placeholder:text-gray-500'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='password'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='password'>Contraseña</FormLabel>
                  <div className='flex justify-between'>
                    <FormControl>
                      <Input
                        id='password'
                        placeholder='********'
                        className='dark:placeholder:text-gray-500'
                        type={verContraseña ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type='button'
                      variant={'icon'}
                      onClick={handlePassword}
                    >
                      {verContraseña ? <EyeOff></EyeOff> : <Eye></Eye>}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Label>¿Olvidaste tu contraseña?</Label>
        {/* <Button variant={'link'} className='border-none text-sm font-normal'>
          Recuperar
        </Button> */}
        <PasswordRecovery />
      </CardContent>
      <CardFooter>
        <Button className='w-1/2' form='login' type='submit'>
          Iniciar
        </Button>
      </CardFooter>
    </Card>
  )
}
