import FotoSelector from './FotoSelector'
import { useEffect, useState } from 'react'
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
import ChichoHablaPerfil from './ComponentesEspecifico/ChichoHablaPerfil'
import { supabase } from './supabase/client'
import { useSession } from './contexts/SessionContext'
import Switchers from './ComponentesEspecifico/Switchers'
import { profilePictures } from '@/constants/profilePictures'
import { useProfilePic } from './contexts/ProfilePicContext'
import { useEvents } from './contexts/EventsContext'
import { useObjetivos } from './contexts/ObjetivosContext'
//TODO: si no tiene una sesion abierta no se deberia poder personalizar, ni cambiar perfil

const formSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario no puede tener más de 30 caracteres'),
  email: z.string().email('Por favor, ingresa un email válido'),
})
type FormValues = z.infer<typeof formSchema>

export default function Usuario() {
  const [, setLocation] = useLocation()
  const { setEvents, setSelectedEvent } = useEvents()
  const { setObjetivosFav } = useObjetivos()

  const { session } = useSession()
  const user = session?.user

  const handleLogin = () => {
    supabase.auth.signOut().catch((error: unknown) => console.error(error))
    setEvents([])
    setObjetivosFav([])
    setSelectedEvent(null)
    setLocation('/login')
  }

  // que los default sean los anteriores, ver cuando este la DB
  const [currentUsername, setCurrentUsername] = useState(
    () =>
      (user?.user_metadata.name as string | undefined) ?? 'Invitado de Chicho'
  )
  const [currentEmail, setCurrentEmail] = useState(
    () => user?.email ?? 'invchicho@cmail.capy'
  )

  supabase.auth
    .getUser()
    .then(({ data: { user } }) => {
      if (user?.user_metadata) {
        setCurrentUsername(user.user_metadata.name as string)
        setConfirmedUsername(user.user_metadata.name as string)
      }
      if (user?.email) setCurrentEmail(user.email)
    })
    .catch((error: unknown) => console.error(error))

  const [selectedPicture, setSelectedPicture] = useState<string | undefined>(
    undefined
  )
  const [confirmedPicture, setConfirmedPicture] = useState<string | undefined>(
    undefined
  )
  const [confirmedUsername, setConfirmedUsername] = useState(currentUsername)

  const [sheetOpen, setSheetOpen] = useState(false)

  const handleConfirm = (data: FormValues) => {
    setConfirmedUsername(data.username)
    supabase.auth
      .updateUser({
        data: {
          name: data.username,
        },
      })
      .catch((error: unknown) => console.error(error))

    if (selectedPicture) {
      console.log(user?.id)
      setConfirmedPicture(selectedPicture)
      supabase
        .from('Usuarios')
        .update({ fotoPerfil: profilePictures.indexOf(selectedPicture) })
        .eq('id', user?.id)
        .then(res => {
          console.log(res)
        })
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
  const watchPicture = selectedPicture

  const hasChanges =
    watchUsername !== confirmedUsername || watchPicture !== confirmedPicture

  const handleProfilePictureSelect = (picture: string) => {
    setSelectedPicture(picture)
  }

  const { profilePic, setProfilePic } = useProfilePic()

  function getProfilePicture() {
    supabase
      .from('Usuarios')
      .select('fotoPerfil')
      .eq('id', user?.id)
      .then(({ data }) => {
        if (!data) return
        const fotoSrc = profilePictures[data[0].fotoPerfil as number]
        setConfirmedPicture(fotoSrc)
        setProfilePic(fotoSrc)
      })

    return profilePic
  }

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyDatos!</h1>
      <div className='mt-10 flex flex-col gap-20 p-10 md:flex-row'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
          <div className='flex h-full w-full items-center justify-center'>
            <div className='m-auto'>
              <ChichoHablaPerfil imagen={confirmedPicture} />
              <video src='/idle.webm' autoPlay loop muted playsInline />
            </div>
          </div>
          <Card className='flex h-full w-full flex-col bg-secondary shadow-md dark:bg-secondary/80'>
            <CardHeader className='text-center'>
              <Avatar className='mx-auto h-40 w-40'>
                <AvatarImage
                  src={getProfilePicture()}
                  className='h-full w-full'
                />
                <AvatarFallback className='border border-accent-foreground bg-accent text-4xl font-medium'>
                  {confirmedUsername
                    .split(' ')
                    .filter(
                      palabra => palabra.at(0)?.toUpperCase() === palabra.at(0)
                    )
                    .map(palabra => palabra.at(0)?.toUpperCase())
                    .join('')
                    .slice(0, 2)}
                </AvatarFallback>
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
              <div className='items-center'>
                <p className='flex items-center text-3xl font-semibold'>
                  {confirmedUsername}
                  {session && (
                    <div>
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
                          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                          <form onSubmit={handleSubmit(handleConfirm)}>
                            <ScrollArea className='h-[80vh] pr-4'>
                              <SheetTitle className='text-lg font-semibold'>
                                Datos del usuario
                              </SheetTitle>
                              <hr className='py-2' />
                              <div className='grid gap-7'>
                                <div className='grid gap-2 px-1'>
                                  <Label
                                    htmlFor='username'
                                    className='text-left'
                                  >
                                    Nombre de usuario
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
                                    Object.keys(errors).length > 0 ||
                                    !hasChanges
                                  }
                                  onClick={() => ''}
                                >
                                  Confirmar
                                </Button>
                              </SheetClose>
                            </SheetFooter>
                          </form>
                        </SheetContent>
                      </Sheet>
                    </div>
                  )}
                </p>
              </div>
              <div className='m-2'>
                <p className='text-lg font-normal'>{currentEmail}</p>
              </div>
              <div className='w-full'>
                <h3 className='mt-8 select-none text-left text-xl font-bold'>
                  Personalizar
                </h3>
                {/* Switch: */}
                <Switchers />
              </div>
            </CardContent>
            <CardFooter className='mt-auto flex select-none justify-end'>
              <div className='space-x-4'>
                <Button
                  variant={'destructive'}
                  onClick={() => handleLogin()}
                  className='mt-4'
                >
                  {session ? 'Cerrar sesión' : 'Iniciar Sesión'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
