import DiscordChat from './ComponentesEspecifico/DiscordChat'
import { Button } from './ui/button'

export default function DiscordComponent() {
  const handleInvitacion = () => {
    window.open(
      'https://discord.gg/q5WmNhU7za',
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className='text-pretty'>
      <div className=''>
        <section className='py-12 text-center'>
          <h1 className='mb-4 text-5xl font-extrabold text-gray-800 dark:text-white'>
            ¿Quieres ayudarnos a detectar errores en la pagina?
            {/* <span className='text-[#f2b76a]'>CapyFocus</span> */}
          </h1>
          <p className='mb-6 p-2 text-xl text-gray-700 dark:text-white'>
            Tenemos un servidor de discord en el que relacionarte con personas
            que usan la pagina y ponerte en contacto directo con los
            desarrolladores
          </p>
          <span className='text-xl text-[#e16d3f]'>¡Solo hay 2 reglas!</span>
          <div className='flex flex-col items-center justify-around gap-4 py-8 sm:flex-row'>
            <div className='max-w-md transform transition-transform duration-300 hover:scale-105'>
              <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
                <span className='flex items-center justify-center gap-2'>
                  {/* <Timer /> */}
                  Respetar a los desarrolladores
                </span>
              </h2>
              <p className='text-lg text-gray-600 dark:text-white'>
                El tiempo que tenemos es apretado y estamos aprendiendo
              </p>
              <div>
                <Button
                  className='mt-4 gap-2 rounded-lg bg-[#f2b76a] px-6 py-2 text-white transition-colors duration-300 hover:bg-[#e16d3f]'
                  onClick={handleInvitacion}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-discord flex'
                    viewBox='0 0 16 16'
                  >
                    <path d='M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612' />
                  </svg>
                  Ingresa al server
                </Button>
              </div>
            </div>
            <div className='max-w-md transform transition-transform duration-300 hover:scale-105'>
              <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
                <span className='flex items-center justify-center gap-2'>
                  {/* <Hourglass /> */}
                  Respetar al otro usuario
                </span>
              </h2>
              <p className='text-lg text-gray-600 dark:text-white'>
                Estamos en un ambiente común, asi que hay que llevarse bien
              </p>
              <DiscordChat />
            </div>
          </div>
          <h3 className='mb-4 text-xl font-extrabold text-gray-800 dark:text-white'>
            Sin más, esperamos que disfrutes la pagina y te esperamos en el
            discord
          </h3>
          <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
            CapySaludos
          </h2>
        </section>
      </div>
    </div>
  )
}
