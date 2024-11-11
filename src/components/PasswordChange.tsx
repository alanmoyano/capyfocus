import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { supabase } from '@/components/supabase/client'
import { toast } from 'sonner'
import { useLocation } from 'wouter'
import { useSession } from '@/components/contexts/SessionContext'

const formSchema = z.object({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export default function PasswordChange() {
  const { session } = useSession()
  const [, setLocation] = useLocation()

  if (!session) setLocation('/login')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    supabase.auth
      .updateUser({ password: values.password })
      .catch((err: unknown) => toast.error(err as string))

    toast.success('Contraseña cambiada correctamente')
    setLocation('/usuario')
  }

  return (
    <Form {...form}>
      <form
        className='mx-auto mt-4 w-full max-w-md space-y-6 rounded-lg border p-6 shadow-sm'
        // eslint-disable-next-line
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='space-y-2'>
          <h2 className='text-center text-2xl font-bold'>Cambiar Contraseña</h2>
          <p className='text-center text-sm text-muted-foreground'>
            Ingresa tu nueva contraseña
          </p>
        </div>

        <FormField
          name='password'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  {...field}
                  placeholder='********'
                  className='input'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full' type='submit'>
          Cambiar Contraseña
        </Button>
      </form>
    </Form>
  )
}
