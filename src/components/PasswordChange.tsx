import { supabase } from '@/components/supabase/client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useLocation } from 'wouter'
import { z } from 'zod'

const formSchema = z.object({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export default function PasswordChange() {
  const [, setLocation] = useLocation()
  const pending = useRef(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (pending.current) return
    pending.current = true

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })
      if (error) throw error
    } catch {
      toast.error('No se pudo cambiar la contraseña. Intentá nuevamente.')
      return
    } finally {
      pending.current = false
    }

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
        <Button
          className='w-full'
          type='submit'
          disabled={form.formState.isSubmitting}
          aria-busy={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
        </Button>
      </form>
    </Form>
  )
}
