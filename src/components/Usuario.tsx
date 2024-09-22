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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import { useLocation } from 'wouter'

export default function Usuario() {
  const [, setLocation] = useLocation()

  const handleLogin = () => {
    setLocation('/login')
  }

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
        <Card className='h-full w-full'>
          <CardHeader className='text-center'>
            <CardTitle className='text-xl'>Hola, @capyUsuario!</CardTitle>
            <CardDescription className='text-center'>
            <Avatar className='mx-auto w-32 h-32'>
              <AvatarImage src='/capyPic.png' className='w-full h-full' />
              <AvatarFallback className='text-2xl'>CN</AvatarFallback>
            </Avatar>
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <p className='text-lg'>Card Content</p>
          </CardContent>
          <CardFooter className='text-center'>
            <p>Card Footer</p>
          </CardFooter>
          <Button onClick={() => handleLogin()} className='mt-4'>
              Inciar sesion
            </Button>
        </Card>
      </div>
     </div>
     
      
    </>
  )
}
