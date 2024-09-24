import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoginForm from './LoginForm'
import SignupForm from './SignUpForm'

export default function Login() {
  return (
    <section className='mt-4 flex h-full w-[80vw] items-center justify-center rounded-[10rem] bg-secondary/60 p-4 text-current md:h-[90vh]'>
      <div className='xl:gap-30 flex flex-col p-10 sm:gap-10 md:flex-row lg:gap-20 2xl:gap-40'>
        <div className='m-auto w-full max-w-[300px] md:max-w-[366px]'>
          <img
            src='/girando.gif'
            className='aspect-[366/301] h-auto w-full object-contain'
            alt='capybara animation'
          />
        </div>

        <div className='m-auto w-full max-w-[400px] px-4 sm:px-0'>
          <div className='mb-4 mt-2'>
            <Tabs defaultValue='signUp' className='w-full'>
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
