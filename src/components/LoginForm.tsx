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
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthError } from '@supabase/supabase-js'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useLocation } from 'wouter'
import { z } from 'zod'
import PasswordRecovery from './ComponentesEspecifico/PasswordRecovery'
import { useSession } from './contexts/SessionContext'
import { supabase } from './supabase/client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import posthog from 'posthog-js'

const formSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
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
      if (error) throw error

      setSession(data.session)
      posthog.identify(data.user.id)
      posthog.capture('Capysesión iniciada')
      console.log(data)
    }

    toast.promise(logIn, {
      loading: 'Iniciando sesión...',
      success: () => {
        setLocation('/usuario')
        return 'Sesión iniciada correctamente'
      },
      error: (error: AuthError | null) => {
        console.error(error)

        switch (error?.message) {
          case 'Email not confirmed':
            return 'Debés confirmar tu email primero!'
          case 'Invalid login credentials':
            return 'Credenciales de inicio de sesión inválidas'
          default:
            return 'Error al iniciar sesión'
        }
      },
    })
  }

  return (
    <Card className='h-auto'>
      <CardHeader>
        <CardTitle>Inicie Sesión</CardTitle>
        <CardDescription>
          Te damos la CapyBienvenida, ingresa tus datos para iniciar sesión.
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
        <PasswordRecovery />
      </CardContent>
      <CardFooter>
        <div className='w-full'>
          <div className='flex justify-end'>
            <Button className='w-1/2' form='login' type='submit'>
              Iniciar
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
