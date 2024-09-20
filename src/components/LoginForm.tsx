import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginForm() {
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
          <Input placeholder='Chicho' type='text' />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='contraseña' className='font-medium'>
            Contraseña
          </Label>
          <Input id='contraseña' placeholder='********' type='password' />
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
