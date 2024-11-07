import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'

const formSchema = z.object({
  email: z.string().email('El email no es válido'),
})

export default function PasswordRecovery() {
  // Formulario de recuperar contraseña:
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit({ email }: { email: string }) {
    // supabase.auth
    //   .resetPasswordForEmail(email, {
    //     redirectTo: 'https://www.capyfocus.com/login',
    //   })
    //   .then(res => console.log(res))
    //   .catch((err: unknown) => console.error(err))
    console.log(email)
    // toast.success('Enviado!')
    toast.warning(
      'Esta funcionalidad aún no está disponible, pero pronto lo estará. ¡Gracias por tu paciencia!'
    )
  }

  return (
    <>
      <Dialog
      //  open={open} si bien esto ayuda, también hace que no se pueda cerrar con ESC o con la X, repensar! (alan)
      >
        <DialogTrigger asChild>
          <Button type='button' variant='link'>
            Recuperar
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Recuperar contraseña</DialogTitle>
            <DialogDescription>
              Ingresa el email asociado a tu capyCuenta:
            </DialogDescription>
          </DialogHeader>

          <div className='mx-auto w-full max-w-md rounded-md border p-4'>
            <Form {...form}>
              <form
                // eslint-disable-next-line
                onSubmit={form.handleSubmit(onSubmit)}
                id='passwordRecovery'
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
                <DialogFooter>
                  <Button>Enviar</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
