import { useState } from 'react'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocation } from 'wouter'

const formSchema = z.object({
  username: z.string().min(5, 'El nombre de usuario debe tener al menos 5 caracteres').max(15, 'El nombre de usuario no puede tener más de 15 caracteres'),
  email: z.string().email('Por favor, ingresa un email válido'),
})
type FormValues = z.infer<typeof formSchema>

export default function Usuario() {
  const [, setLocation] = useLocation()

  const handleLogin = () => {
    setLocation('/login')
  }

  // que los default sean los anteriores
  const [confirmedUsername, setConfirmedUsername] = useState("Chicho Perez")
  const [confirmedEmail, setConfirmedEmail] = useState("hola@chicho.com")
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleConfirm = (data: FormValues) => {
    setConfirmedUsername(data.username)
    setConfirmedEmail(data.email)
    setSheetOpen(false)
  }


  const { register, handleSubmit, watch, formState: { errors }, } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: confirmedUsername,
      email: confirmedEmail,
    }
  })

  const username = watch("username")
  const email = watch("email")

  return (
    <>
      <h1 className='mb-4 text-4xl font-bold'>Capy Datos</h1>
      <div className='mt-10 flex flex-col gap-20 p-10 md:flex-row'>
        <div className='grid grid-cols-2 gap-10'>
          <div className='flex h-full w-full items-center justify-center'>
            <div className='m-auto'>
              <video src='/idle.webm' autoPlay loop muted playsInline />
            </div>
          </div>
          <Card className='h-full w-full bg-secondary shadow-md'>
            <CardHeader className='text-center'>
              <CardTitle className='py-4 text-xl font-medium'>
                Hola!
              </CardTitle>
              <CardDescription className='text-center'>
                <Avatar className='mx-auto h-32 w-32 hover:cursor-pointer'>
                  <AvatarImage
                    src='/capyPic.jpg'
                    className='h-full w-full'
                  />
                  <AvatarFallback className='text-2xl'>
                    CN
                  </AvatarFallback>
                </Avatar>
                {/* { infoAvatar && (
                                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                                  <div className='bg-white p-4 rounded-lg'>
                                    <h2 className='text-xl font-bold'>Descripción del Avatar</h2>
                                    <p>Esta es la descripción del avatar.</p>
                                    <button
                                      className='mt-4 px-4 py-2 bg-primary text-white rounded'
                                      onClick={() => setInfoAvatar(false)}
                                    >
                                      Cerrar
                                    </button>
                                  </div>
                                </div>
                              )} */}

              </CardDescription>
            </CardHeader>
            {/* Poner email y usuario al medio */}
            <CardContent className='text-center'>
              <p className='text-3xl font-semibold'>Chicho Perez</p>
              <div className='m-4 items-center'>
                <div className='grid w-full max-w-sm gap-1.5 p-4 text-left'>
                  <p>{confirmedEmail}</p>
                </div>
                <div className='grid w-full max-w-sm gap-1.5 p-4 text-left'>
                  <p>{confirmedUsername}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
              <div className='space-x-4'>
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant='outline'>Modificar perfil</Button>
                  </SheetTrigger>
                  <SheetContent className='w-full sm:max-w-md'>
                    <SheetHeader className='pb-7'>
                      <SheetTitle className='text-2xl font-bold'>Modificar perfil</SheetTitle>
                      {/* <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                      </SheetDescription> */}
                    </SheetHeader>
                    <SheetTitle className='text-lg font-semibold'>Datos del perfil</SheetTitle>
                    <hr className='py-2' />
                    <form onSubmit={handleSubmit(handleConfirm)}>
                      <div className='grid gap-7 py-4'>
                        <div className='grid gap-2'>
                          <Label htmlFor='username' className='text-left'>
                            Usuario
                          </Label>
                          <Input id='username' placeholder='Usuario' {...register('username')} className='w-full' />
                          {errors.username && (
                            <p className="text-red-500 text-sm">
                              {errors.username.message}
                            </p>
                          )}
                        </div>
                        <div className='grid gap-2'>
                          <Label htmlFor='email' className='text-left'>
                            Email
                          </Label>
                          <Input id='email' placeholder='Email' {...register('email')} className='w-full' />
                          {errors.email && (
                            <p className="text-red-500 text-sm">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                    <SheetTitle className='text-lg font-semibold pt-4'>Foto de perfil</SheetTitle>
                    <hr className='py-2' />
                    <SheetFooter>
                      <SheetClose asChild>
                        {/* Si hay errores que no se cierre! */}
                        <Button type='submit' disabled={Object.keys(errors).length > 0}>Confirmar</Button>
                      </SheetClose>
                    </SheetFooter>
                  </form>
                </SheetContent>
              </Sheet>
              <Button onClick={() => handleLogin()} className='mt-4'>
                Cerrar sesión
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div >
    </>
  )
}
