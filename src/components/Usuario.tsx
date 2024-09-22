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
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import { useLocation } from 'wouter'

export default function Usuario() {
  const [, setLocation] = useLocation()

  const handleLogin = () => {
    setLocation('/login')
  }

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConfirm = () => {
    setDialogOpen(false);
  };

  return (
    <>
     <h1 className='text-4xl font-bold mb-4'>Capy Datos</h1>
     <div className='mt-10 flex flex-col gap-20 p-10 md:flex-row'>
     <div className='grid grid-cols-2 gap-8'>
        <Card className='h-full w-full'>
        <CardHeader>
            <CardTitle>Agus!</CardTitle>
            </CardHeader>
            <div className='m-auto'>
                <img src='/idle.gif' />
            </div>
        </Card>
        <Card className='h-full w-full shadow-md bg-secondary'>
          <CardHeader className='text-center'>
            <CardTitle className='text-xl py-4'>Hola, @capyUsuario!</CardTitle>
            <CardDescription className='text-center'>
              <TooltipProvider>
                <Tooltip>
                  {/* Arreglar tooltip! */}
                  <TooltipTrigger asChild>
                    <div className='relative'>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Avatar className='mx-auto w-32 h-32'>
                            <AvatarImage src='/capyPic.png' className='w-full h-full' />
                              <AvatarFallback className='text-2xl'>CN</AvatarFallback>
                          </Avatar>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Datos del perfil</DialogTitle>
                            <DialogDescription>
                              Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Username
                              </Label>
                              <Input
                                id="username"
                                defaultValue="Chicho Perez"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="email"
                                defaultValue="hola@chicho.com"
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={() => handleConfirm()}>Confirmar</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Modificar datos del perfil</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <p className='text-xl'>Chicho Perez</p>
            <div className='m-4'>
              <div className="grid w-full max-w-sm items-start gap-1.5 text-left p-4">
                <Label htmlFor="email">Email</Label>
                <Input disabled type="mail" id="email" placeholder="hola@chicho.com" />
              </div>
              <div className="grid w-full max-w-sm items-start gap-1.5 text-left p-4">
                <Label htmlFor="username">Usuario</Label>
                <Input disabled type="username" id="username" placeholder="Chichito24" />
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-end'>
            <Button onClick={() => handleLogin()} className='mt-4'>
              Inciar sesion?
            </Button>
          </CardFooter>
        </Card>
      </div>
     </div>
     
      
    </>
  )
}
