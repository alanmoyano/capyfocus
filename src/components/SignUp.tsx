import { Link } from 'wouter'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function SignUp() {
  return (
    <>
      <main className='flex h-full w-[80vw] items-center justify-center rounded-[10rem] bg-secondary p-4 text-current md:h-[70vh]'>
        <div className='xl:gap-30 flex flex-col p-10 sm:gap-10 md:flex-row lg:gap-20 2xl:gap-40'>
          <div className='m-auto'>
            <img
              src='/girando.gif'
              width={412}
              height={395}
              className='aspect-[366/301]'
            />
          </div>

          <div className='m-auto'>
            <div className='mb-4 mt-2'>
              <h1 className='mx-1 text-pretty text-center text-2xl font-bold md:text-3xl lg:text-4xl'>
                Regístrate
              </h1>
              <p className='ml-1 text-pretty text-center text-lg text-muted'>
                Ingrese sus credenciales para continuar
              </p>
            </div>

            <form
              className='flex flex-col gap-4'
              // onSubmit={(e) => e.preventDefault()}
              action='https://google.com'
              autoComplete='off'
              id='form'
            >
              <div className='flex flex-row gap-2'>
                <div className='flex flex-col'>
                  <label>Nombre</label>
                  <Input placeholder='Brenda' type='text' />
                </div>

                <div className='flex flex-col'>
                  <label>Apellido</label>
                  <Input placeholder='Tapari' type='text' />
                </div>
              </div>

              <div className='flex flex-col'>
                <label>Correo</label>
                <Input placeholder='breightend@gmail.com' type='text' />
              </div>

              <div className='flex flex-col'>
                <label>Contraseña</label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter password'
                />
              </div>

              <div className='flex flex-col'>
                <label>Confirmar contraseña</label>
                <Input
                  id='passwordConfirmation'
                  type='password'
                  placeholder='Enter password'
                />
              </div>
            </form>

            <p className='ml-2 mt-1 text-muted'>
              Ya tienes una cuenta?{' '}
              <Link
                to='/login'
                className='text-text rounded-lg px-1 font-semibold transition-all duration-200 hover:bg-primary/50'
              >
                inicia sesión aquí
              </Link>
            </p>
            <Button
              type='submit'
              form='form'
              className='text-cream ml-auto mt-4 flex justify-end'
            >
              Registrarme
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
