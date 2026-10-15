import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { profilePictures } from '@/constants/profilePictures'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'wouter'
import { z } from 'zod'
import ChichoHablaPerfil from './ComponentesEspecifico/ChichoHablaPerfil'
import Switchers from './ComponentesEspecifico/Switchers'
import { useProfilePic } from './contexts/ProfilePicContext'
import { useSession } from './contexts/SessionContext'
import FotoSelector from './FotoSelector'
import { supabase } from './supabase/client'
import { toast } from 'sonner'
import Reproductor from '@/components/ComponentesEspecifico/Reproductor'

const formSchema = z.object({
  username: z
    .string()
    .min(2, 'El nombre de usuario debe tener al menos 2 caracteres')
    .max(30, 'El nombre de usuario no puede tener más de 30 caracteres'),
})
type FormValues = z.infer<typeof formSchema>

export default function Usuario() {
  const [, setLocation] = useLocation()
  const { session } = useSession()
  const user = session?.user

  const [signingOut, setSigningOut] = useState(false)
  const handleLogin = async () => {
    if (!session) {
      setLocation('/login')
      return
    }
    setSigningOut(true)
    try {
      // El SDK administra su storage y devuelve los fallos en `error`.
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setLocation('/login')
    } catch {
      toast.error('No se pudo cerrar sesión. Intenta de nuevo.')
    } finally {
      setSigningOut(false)
    }
  }

  const [currentUsername] = useState(
    () =>
      (user?.user_metadata.name as string | undefined) ?? 'Invitado de Chicho'
  )

  const currentEmail = user?.email ?? 'invchicho@cmail.capy'

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

    if (!session) return
    supabase
      .from('Usuarios')
      .update({ nombre: data.username })
      .eq('id', session.user.id)
      .then(({ data, error }) => {
        if (error) console.error(error)
        console.log(data)
      })

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
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username:
        (session?.user.user_metadata.name as string | undefined) ??
        currentUsername,
    },
  })

  useEffect(() => {
    if (session) setValue('username', session.user.user_metadata.name as string)
  }, [session, setValue])

  const watchUsername = watch('username')
  const watchPicture = selectedPicture

  const hasChanges =
    watchUsername !== confirmedUsername || watchPicture !== confirmedPicture

  const handleProfilePictureSelect = (picture: string) => {
    setSelectedPicture(picture)
  }

  const { profilePic, setProfilePic } = useProfilePic()

  const userId = user?.id
  useEffect(() => {
    if (!userId) return
    let active = true
    void supabase
      .from('Usuarios')
      .select('fotoPerfil')
      .eq('id', userId)
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          console.error(error)
          return
        }
        const index: unknown = data.at(0)?.fotoPerfil
        const fotoSrc =
          typeof index === 'number' ? profilePictures[index] : undefined
        if (!fotoSrc) return
        setConfirmedPicture(fotoSrc)
        setProfilePic(fotoSrc)
      })
    return () => {
      active = false
    }
  }, [userId, setProfilePic])

  return (
    <>
      <h1 className='mt-4 text-4xl font-bold'>CapyDatos!</h1>
      <div className='flex flex-col gap-20 p-10 md:flex-row'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
          <div className='flex h-full w-full items-center justify-center'>
            <div className='m-auto'>
              <ChichoHablaPerfil imagen={confirmedPicture} />
              <Reproductor src='/CapyNada' />
            </div>
          </div>
          <Card className='flex h-full w-full flex-col bg-secondary shadow-md dark:bg-secondary/80'>
            <CardHeader className='text-center'>
              <Avatar className='mx-auto h-40 w-40'>
                <AvatarImage src={profilePic} className='h-full w-full' />
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
              <CardDescription className='text-center'></CardDescription>
            </CardHeader>
            <CardContent className='flex flex-grow flex-col items-center justify-start text-center'>
              <div className='flex items-center text-3xl font-semibold'>
                {confirmedUsername}
                {session && confirmedUsername !== 'Invitado de Chicho' && (
                  <div>
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                      <SheetTrigger asChild className='ml-2 cursor-pointer'>
                        <Pencil />
                      </SheetTrigger>
                      <SheetContent className='w-full sm:max-w-md'>
                        <SheetHeader className='pb-7'>
                          <SheetTitle className='text-2xl font-bold'>
                            Modificar perfil
                          </SheetTitle>
                        </SheetHeader>
                        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                        <form onSubmit={handleSubmit(handleConfirm)}>
                          <ScrollArea className='h-[80dvh] pr-4'>
                            <SheetTitle className='text-lg font-semibold'>
                              Datos del usuario
                            </SheetTitle>
                            <hr className='py-2' />
                            <div className='grid gap-7'>
                              <div className='grid gap-2 px-1'>
                                <Label htmlFor='username' className='text-left'>
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
                                  Object.keys(errors).length > 0 || !hasChanges
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
              </div>
              <div className='m-2'>
                <p className='text-lg font-normal'>{currentEmail}</p>
              </div>
              <div className='w-full'>
                <h3 className='mt-8 select-none text-left text-xl font-bold'>
                  Personalizar
                </h3>
                {/* Switch: */}
                {session ? (
                  <Switchers />
                ) : (
                  <div className='flex justify-center'>
                    <p className='font-medium'>
                      Inicia sesión para personalizar!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className='mt-auto flex select-none justify-end'>
              <div className='space-x-4'>
                {session && (
                  <Button
                    onClick={() => {
                      setLocation('/cambiarContraseña')
                    }}
                  >
                    Cambiar contraseña
                  </Button>
                )}
                <Button
                  variant={session ? 'destructive' : 'default'}
                  disabled={signingOut}
                  onClick={() => {
                    void handleLogin()
                  }}
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
