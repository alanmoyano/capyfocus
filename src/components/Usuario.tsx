import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useLocation } from 'wouter'

export default function Usuario() {
  const [, setLocation] = useLocation()

  const handleLogin = () => {
    setLocation('/login')
  }

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleConfirm = () => {
    setDialogOpen(false)
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
          <Card className='h-full w-full bg-secondary shadow-md'>
            <CardHeader className='text-center'>
              <CardTitle className='py-4 text-xl'>
                Hola, @capyUsuario!
              </CardTitle>
              <CardDescription className='text-center'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='relative'>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Avatar className='mx-auto h-32 w-32 hover:cursor-pointer'>
                              <AvatarImage
                                src='/capyPic.jpg'
                                className='h-full w-full'
                              />
                              <AvatarFallback className='text-2xl'>
                                CN
                              </AvatarFallback>
                            </Avatar>
                          </DialogTrigger>
                          <DialogContent className='sm:max-w-[425px]'>
                            <DialogHeader>
                              <DialogTitle>Datos del perfil</DialogTitle>
                              <DialogDescription>
                                Haz los cambios de tu CapyPerfil aquí.
                              </DialogDescription>
                            </DialogHeader>
                            <div className='grid gap-4 py-4'>
                              <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                  htmlFor='username'
                                  className='text-right'
                                >
                                  Username
                                </Label>
                                <Input
                                  id='username'
                                  defaultValue='Chicho Perez'
                                  className='col-span-3'
                                />
                              </div>
                              <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor='email' className='text-right'>
                                  Email
                                </Label>
                                <Input
                                  id='email'
                                  defaultValue='hola@chicho.com'
                                  className='col-span-3'
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => handleConfirm()}>
                                Confirmar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TooltipTrigger>
                    {/* Arreglar tooltip para que salga a la derecha! */}
                    <TooltipContent className='absolute left-full top-1/2 ml-2 -translate-y-1/2 transform'>
                      <p>Modificar datos del perfil</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center'>
              <p className='text-xl'>Chicho Perez</p>
              <div className='m-4'>
                <div className='grid w-full max-w-sm items-start gap-1.5 p-4 text-left'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    disabled
                    type='mail'
                    id='email'
                    placeholder='hola@chicho.com'
                  />
                </div>
                <div className='grid w-full max-w-sm items-start gap-1.5 p-4 text-left'>
                  <Label htmlFor='username'>Usuario</Label>
                  <Input
                    disabled
                    type='username'
                    id='username'
                    placeholder='Chichito24'
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
              <Button onClick={() => handleLogin()} className='mt-4'>
                Cerrar sesión
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
