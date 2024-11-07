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
    <div className='h-full w-full text-pretty bg-gradient-to-r from-yellow-50 to-purple-50 py-12 text-center dark:from-slate-900 dark:to-orange-950'>
      <div className=''>
        <section className='text-center'>
          <h1 className='mb-4 text-5xl font-extrabold text-gray-800 dark:text-white'>
            Conectate con otros usuarios o detecta errores
          </h1>
          <p className='mb-6 p-2 text-xl text-gray-700 dark:text-white'>
            Contamos con un servidor de discord en el que relacionarte con
            personas que usan la página o ponerte en contacto directo con los
            desarrolladores para realizar consultas, sugerencias o notificar
            cualquier error que encuentres. ¡Tu feedback es clave para seguir
            mejorando!
          </p>
          <span className='text-2xl text-[#e16d3f]'>¡Solo hay 2 reglas!</span>
          <div className='flex flex-col items-center justify-center gap-x-6 py-8 sm:flex-row sm:items-start sm:gap-8'>
            <div className='flex flex-wrap gap-x-32'>
              <div className='max-w-md flex-1 transform transition-transform duration-300 hover:scale-105'>
                <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
                  <span className='flex items-center justify-center'>
                    1. Respetar a los CapyUsuario
                  </span>
                </h2>
                <p className='text-lg text-gray-600 dark:text-white'>
                  Este es un espacio para compartir y aprender, hecho por y para
                  la comunidad de CapyFocus, respetemosnos y aprendamos de esta
                  experiencia juntos.
                </p>
                <div>
                  <Button
                    className='mt-4 gap-2 rounded-lg bg-[#4d58df] px-6 py-2 text-white transition-colors duration-300 hover:bg-[#5d67d1]'
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
              <div className='max-w-md flex-1 transform transition-transform duration-300 hover:scale-105'>
                <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
                  <span className='flex items-center justify-center gap-2'>
                    2. Valora el esfuerzo de los desarrolladores
                  </span>
                </h2>
                <p className='text-lg text-gray-600 dark:text-white'>
                  Estamos contra reloj, mejorando constantemente y con café en
                  mano. ¡Tu paciencia y apoyo son muy valiosos para nosotros!
                </p>
                <DiscordChat />
              </div>
            </div>
          </div>

          <h3 className='mb-4 text-xl font-extrabold text-gray-800 dark:text-white'>
            Sin más, esperamos que disfrutes la página y te esperamos en el
            servidor de discord
          </h3>
          <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
            CapySaludos
          </h2>
        </section>
      </div>
    </div>
  )
}
