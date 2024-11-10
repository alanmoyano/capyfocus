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

const formSchema = z.object({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export default function PasswordChange() {
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
  }

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
                  placeholder='Contraseña'
                  className='input'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Enviar</Button>
      </form>
    </Form>
  )
}
