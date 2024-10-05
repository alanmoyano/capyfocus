import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
  const [verContraseña, setVerContraseña] = useState(false)

  const handlePassword = () => {
    setVerContraseña(!verContraseña)
  }

  return (
    <Card className='h-auto'>
      <CardHeader>
        <CardTitle>Inicie Sesión</CardTitle>
        <CardDescription>
          Bienvenido de vuelta, ingresa tus datos para iniciar sesión.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='space-y-1'>
          <Label htmlFor='username' className='font-medium'>
            Usuario
          </Label>
          <Input placeholder='Chicho' className='dark:placeholder:text-gray-500' type='text' />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='contraseña' className='font-medium'>
            Contraseña
          </Label>
          <div className='flex justify-between'>
            <Input
              id='contraseña'
              placeholder='********'
              className='dark:placeholder:text-gray-500'
              type={verContraseña ? 'text' : 'password'}
            />
            <Button type='button' variant={'icon'} onClick={handlePassword}>
              {verContraseña ? <EyeOff></EyeOff> : <Eye></Eye>}
            </Button>
          </div>
        </div>
        <Label>¿Olvidaste tu contraseña?</Label>
        <Button variant={'link'} className='border-none text-sm font-normal'>
          Recuperar
        </Button>
      </CardContent>
      <CardFooter>
        <Button className='w-1/2'>Iniciar</Button>
      </CardFooter>
    </Card>
  )
}
