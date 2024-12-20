import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoginForm from './LoginForm'
import SignupForm from './SignUpForm'
import Reproductor from './ComponentesEspecifico/Reproductor'

import CapyInfo from './ComponentesEspecifico/CapyToast/CapyInfo'

export default function Login() {
  return (
    <section className='my-10 mt-4 flex h-full w-[80vw] items-center justify-center rounded-3xl bg-secondary/60 p-4 text-current sm:h-full sm:rounded-[10rem] md:h-[90vh] dark:bg-secondary/85'>
      <div className='flex flex-col sm:gap-10 sm:p-10 md:flex-row lg:gap-20 2xl:gap-40'>
        <div className='m-auto w-full max-w-[300px] md:max-w-[366px]'>
          <Reproductor
            src='/girando'
            className='aspect-[366/301] h-auto w-full object-contain'
          />
        </div>
        <div className='m-auto w-full max-w-[400px] px-4 sm:px-0'>
          <div className='w-full'>
            <div className='flex justify-end'>
              <span className='flex items-center'>
                <CapyInfo desc='Un invitado es un usuario que no se ha registrado en la plataforma, por lo que no podrá acceder a todas las funcionalidades de la misma. ¡Regístrate para disfrutar de todos los beneficios!' />
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
