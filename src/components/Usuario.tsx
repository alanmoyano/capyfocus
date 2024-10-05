import FotoSelector from './FotoSelector'
import { SetStateAction, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { ScrollArea } from '@/components/ui/scroll-area'

const formSchema = z.object({
  username: z
    .string()
    .min(5, 'El nombre de usuario debe tener al menos 5 caracteres')
    .max(15, 'El nombre de usuario no puede tener más de 15 caracteres'),
  email: z.string().email('Por favor, ingresa un email válido'),
})
type FormValues = z.infer<typeof formSchema>

export default function Usuario() {
  const [, setLocation] = useLocation()

  const handleLogin = () => {
    setLocation('/login')
  }

  // que los default sean los anteriores, ver cuando este la DB
  const currentUsername = 'Chicho'
  const currentEmail = 'chicho@capymail.com'

  const [selectedPicture, setSelectedPicture] = useState<string | undefined>(
    undefined
  )
  const [confirmedPicture, setConfirmedPicture] = useState<string | undefined>(
    undefined
  )
  const [confirmedUsername, setConfirmedUsername] = useState(currentUsername)
  const [confirmedEmail, setConfirmedEmail] = useState(currentEmail)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleConfirm = (data: FormValues) => {
    setConfirmedUsername(data.username)
    setConfirmedEmail(data.email)
    if (selectedPicture) {
      setConfirmedPicture(selectedPicture)
    }
    setSheetOpen(false)
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUsername,
      email: currentEmail,
    },
  })

  const watchUsername = watch('username')
  const watchEmail = watch('email')
  const watchPicture = selectedPicture

  const hasChanges =
    watchUsername !== confirmedUsername ||
    watchEmail !== confirmedEmail ||
    watchPicture !== confirmedPicture

  const handleProfilePictureSelect = (picture: string) => {
    setSelectedPicture(picture)
  }

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
          <Card className='flex h-full w-full flex-col bg-secondary shadow-md dark:bg-secondary/80 '>
            <CardHeader className='text-center'>
              <Avatar className='mx-auto h-40 w-40'>
                <AvatarImage src={confirmedPicture} className='h-full w-full' />
                <AvatarFallback className='text-2xl'>CN</AvatarFallback>
              </Avatar>
              <CardDescription className='text-center'>
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
            <CardContent className='flex flex-grow flex-col items-center justify-start text-center'>
              <div className='flex-grow flex-col items-center'>
                <p className='flex items-center text-3xl font-semibold'>
                  {confirmedUsername}
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-pencil ml-2 hover:cursor-pointer'
                      >
                        <path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' />
                        <path d='m15 5 4 4' />
                      </svg>
                    </SheetTrigger>
                    <SheetContent className='w-full sm:max-w-md'>
                      <SheetHeader className='pb-7'>
                        <SheetTitle className='text-2xl font-bold'>
                          Modificar perfil
                        </SheetTitle>
                      </SheetHeader>
                      <form onSubmit={handleSubmit(handleConfirm)}>
                        <ScrollArea className='h-[80vh] pr-4'>
                          <SheetTitle className='text-lg font-semibold'>
                            Datos del perfil
                          </SheetTitle>
                          <hr className='py-2' />
                          <div className='grid gap-7 py-4'>
                            <div className='grid gap-2'>
                              <Label htmlFor='username' className='text-left'>
                                Usuario
                              </Label>
                              <Input
                                id='username'
                                placeholder='Ingrese un nuevo nombre'
                                {...register('username')}
                                className='w-full dark:placeholder:text-gray-400'
                              />
                              {errors.username && (
                                <p className='text-sm text-red-500'>
                                  {errors.username.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <SheetTitle className='pt-4 text-lg font-semibold'>
                            Foto de perfil
                          </SheetTitle>
                          <hr className='py-2' />
                          <div className='flex h-[80vh] flex-col'>
                            <div>
                              <FotoSelector
                                onSelect={handleProfilePictureSelect}
                              />
                            </div>
                          </div>
                        </ScrollArea>
                        <SheetFooter className='mt-4 flex justify-end'>
                          <SheetClose asChild>
                            <Button
                              type='submit'
                              disabled={
                                Object.keys(errors).length > 0 || !hasChanges
                              }
                            >
                              Confirmar
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </form>
                    </SheetContent>
                  </Sheet>
                </p>
              </div>
              <div className='m-2'>
                <p className='text-lg font-normal'>{confirmedEmail}</p>
              </div>
            </CardContent>
            <CardFooter className='mt-auto flex justify-end'>
              <div className='space-x-4'>
                <Button onClick={() => handleLogin()} className='mt-4'>
                  Cerrar sesión
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
