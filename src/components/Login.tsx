import { Link } from 'wouter'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function Login() {
  return (
    <main className='flex h-full w-[80vw] items-center justify-center rounded-[10rem] bg-secondary p-4 text-current md:h-[70vh]'>
      <div className='xl:gap-30 flex flex-col p-10 sm:gap-10 md:flex-row lg:gap-20 2xl:gap-40'>
        <div className='m-auto'>
          <img
            src='/girando.gif'
            width={366.33}
            height={395}
            className='aspect-[366/301]'
          />
        </div>

        <div className='m-auto'>
          <div className='mb-4 mt-2'>
            <h1 className='mx-1 text-pretty text-center text-2xl font-bold md:text-3xl lg:text-4xl'>
              Inicie sesión
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
            <div className='flex flex-col'>
              <label>Username</label>
              <Input placeholder='Breightend' type='text' />
            </div>

            <div className='flex flex-col'>
              <label>Password</label>
              <Input
                id='password'
                type='password'
                placeholder='Enter password'
              />

              {/* password con ojito para ver o no
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className="block w-full rounded-lg border-gray-200 py-3 pe-10 ps-4 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => {
                    const field = document.getElementById(
                      "password",
                    ) as HTMLInputElement;

                    if (field.type === "password") field.type = "text";
                    else field.type = "password";
                  }}
                  className="text-primary absolute inset-y-0 end-0 z-20 flex cursor-pointer items-center rounded-e-md px-3 focus:text-blue-600 focus:outline-none dark:focus:text-blue-500"
                >
                  <Ojo />
                </button>
              </div>
              */}
            </div>
          </form>

          <p className='ml-2 mt-1 text-muted'>
            No tienes una cuenta?
            <Link
              to='/signup'
              className='rounded-lg px-1 font-semibold text-text transition-all duration-200 hover:bg-primary/50'
            >
              créala aquí
            </Link>
          </p>
          <Button
            type='submit'
            className='ml-auto mt-4 flex justify-end text-cream'
            form='form'
          >
            Iniciar
          </Button>
        </div>
      </div>
    </main>
  )
}
