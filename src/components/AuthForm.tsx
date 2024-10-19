import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoginForm from './LoginForm'
import SignupForm from './SignUpForm'
import Reproductor from './ComponentesEspecifico/Reproductor'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
import {Info} from 'lucide-react'
import CapyInfo from './ComponentesEspecifico/CapyToast/CapyInfo'


export default function Login() {
  const [, setLocation] = useLocation()
  function handleNavigate() {
    setLocation('/')
  }

  return (
    <section className='mt-4 flex h-full w-[80vw] items-center justify-center rounded-[10rem] bg-secondary/60 p-4 text-current md:h-[90vh] dark:bg-secondary/85'>
      <div className='xl:gap-30 flex flex-col p-10 sm:gap-10 md:flex-row lg:gap-20 2xl:gap-40'>
        <div className='m-auto w-full max-w-[300px] md:max-w-[366px]'>
          <Reproductor
            src='/girando.webm'
            className='aspect-[366/301] h-auto w-full object-contain'
          />
        </div>
        <div className='m-auto w-full max-w-[400px] px-4 sm:px-0'>
          <div className='w-full'>
            <div className='flex justify-end'>
              <span className=' flex items-center'>
                <CapyInfo desc='Un invitado es un usuario que no se ha registrado en la plataforma, por lo que no podrá acceder a todas las funcionalidades de la misma. ¡Regístrate para disfrutar de todos los beneficios!'/>
              <Button  onClick={handleNavigate} className='px-6'>Invitado</Button>
              </span>
            </div>
          </div>
          <div className='mb-4 mt-2'>
            <Tabs defaultValue='login' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='login'>Ingrese</TabsTrigger>
                <TabsTrigger value='signUp'>Registrarse</TabsTrigger>
              </TabsList>
              <TabsContent value='login'>
                <LoginForm />
              </TabsContent>
              <TabsContent value='signUp'>
                <SignupForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}
