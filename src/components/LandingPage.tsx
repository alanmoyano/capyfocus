import { Button } from '@/components/ui/button'
import { Timer, Hourglass } from 'lucide-react'
import { useLocation } from 'wouter'

export default function LandingPage() {
  const [, setLocation] = useLocation()

  function handleNavigateInicio() {
    setLocation('/')
  }

  function handleNavigateRegistrar() {
    setLocation('/login')
  }
  //TODO Agregar Esta pagina como landing page
  //TODO hacer responsive
//TODO agregar contenido en about us.
  return (
    <div>
      <div className='bg-white'>
        {/* Comienzo */}
        <section className='py-12 bg-gradient-to-r from-yellow-50 to-purple-50 text-center'>
          <h1 className='mb-4 text-5xl font-extrabold text-gray-800'>
            Optimiza tu tiempo de estudio con{' '}
            <span className='text-[#f2b76a]'>CapyFocus</span>
          </h1>
          <p className='mb-6 text-2xl text-gray-700'>
            Capydoros y Capymetro, dos técnicas que te ayudarán a lograr tus
            objetivos.
          </p>
          <div className='flex items-center justify-around py-12'>
            <div className='max-w-md transform transition-transform duration-300 hover:scale-105'>
              <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
                <span className='flex items-center justify-center gap-4'>
                  <Timer />
                  Capydoro
                </span>
              </h2>
              <p className='text-lg text-gray-600'>
                Basado en la técnica pomodoro, para sesiones de estudio
                eficientes.
              </p>
            </div>
            <div className='max-w-md transform transition-transform duration-300 hover:scale-105'>
              <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
                <span className='flex items-center justify-center gap-4'>
                  <Hourglass />
                  Capymetro
                </span>
              </h2>
              <p className='text-lg text-gray-600'>
                Un cronómetro para medir el tiempo de estudio sin
                interrupciones.
              </p>
            </div>
          </div>
        </section>
 {/* Botones */}
        <section className='py-8'>
          <p className='text-center text-2xl font-semibold text-gray-800'>
            ¡El momento es ahora! ¿Listo para tomar el control de tu tiempo de
            estudio?
          </p>
          <p className='mt-4 text-center text-lg text-gray-700'>
            Con cada sesión, te acercas más al éxito. No dejes que el tiempo se
            te escape, ¡haz que cada minuto cuente!
          </p>
          <p className='mt-6 text-center text-lg text-gray-700'>
            ¿Qué estás esperando? Únete a nosotros y empieza a disfrutar de un
            estudio más productivo y efectivo.
          </p>
          <span className='mt-12 flex w-full justify-center gap-10'>
            <Button
              className='rounded-lg border border-gray-300 bg-white p-8 text-xl text-gray-900 shadow-md transition-all duration-300 hover:bg-gray-100 hover:shadow-lg'
              onClick={handleNavigateRegistrar}
            >
              Registrate
            </Button>
            <Button
              className='rounded-lg bg-[#f2b76a] p-8 text-xl text-white shadow-md transition-all duration-300 hover:shadow-lg'
              onClick={handleNavigateInicio}
              
            >
              Empieza ahora
            </Button>
          </span>
        </section>

        {/* Eventos y Estadisticas */}

        <section className='bg-gradient-to-r from-yellow-50 to-purple-50 py-10 text-center'>
          <h2 className='mb-4 text-4xl font-bold text-gray-700'>
            Crea eventos y alcanza tus metas
          </h2>
          <span className='mb-2 text-lg font-semibold text-gray-600'>
            ¿Tienes un examen o un proyecto importante?
          </span>
          <p className='mb-6 text-lg text-gray-600'>
            Con CapyFocus puedes crear eventos y asignarles objetivos
            específicos para estar siempre en control de tu progreso.
          </p>
          <div className='flex justify-center space-x-6'>
            <div className='max-w-sm transform rounded-lg bg-accent/60 p-6 shadow-xl transition duration-300 hover:scale-105'>
              <img
                src='/FotosLanding/eventos2.png'
                alt='Eventos'
                className='mx-auto mb-6 h-40 w-full rounded-lg object-cover'
              />
              <h3 className='mb-4 text-2xl font-semibold text-gray-700'>
                Organiza tus exámenes
              </h3>
              <p className='text-lg text-gray-600'>
                Define eventos importantes como exámenes o entregas y crea
                objetivos personalizados.
              </p>
            </div>
            <div className='max-w-sm transform rounded-lg bg-accent/60 p-6 shadow-xl transition duration-300 hover:scale-105'>
              <img
                src='/FotosLanding/estadisticas.png'
                alt='Objetivos'
                className='mx-auto mb-6 h-40 w-full rounded-lg object-cover'
              />
              <h3 className='mb-4 text-2xl font-semibold text-gray-700'>
                Sigue tu progreso
              </h3>
              <p className='text-lg text-gray-600'>
                Asocia objetivos a cada evento y sigue tu evolución en tiempo
                real.
              </p>
            </div>
            <div className='max-w-sm transform rounded-lg bg-accent/60 p-6 shadow-xl transition duration-300 hover:scale-105'>
              <img
                src='\FotosLanding\CapyInsignias.png'
                alt='Insignia 1'
                className='mx-auto mb-6 h-40 w-full rounded-lg object-cover'
              />
              <h3 className='mb-4 text-2xl font-semibold text-gray-700'>
                Desbloquea CapyInsignias
              </h3>
              <p className='text-lg text-gray-600'>
                A medida que avances en tus estudios, irás desbloqueando
                insignias que representan tu progreso.
              </p>
            </div>
          </div>
        </section>
{/* Chicho! */}
        <section className='my-16  flex items-center justify-center'>
          {/* Columna 1 */}
          <div className='w-2/3 text-left ml-16'>
            <p className='text-2xl font-semibold text-gray-800'>
              ¡Chicho te ayudara a mantenerte enfocado!
            </p>
            <p className='mt-4 text-lg text-gray-700'>
              Dependiendo de tu estilo de motivación, Chicho puede ser dulce y
              alentador, o firme y directo para que no pierdas el enfoque.
              ¡Elige cómo te hablará y aprovecha cada sesión al máximo!
            </p>
            <p className='mt-4 text-lg text-gray-700'>
              Ajusta su actitud en tu perfil y disfruta de una experiencia de
              estudio totalmente personalizada con CapyFocus.
            </p>
          </div>

          {/* Columna 2 */}
          <div className='w-1/3 flex text-center'>
            <img
              src='\Chicho\OtrasAcciones\CapyOk.gif'
              alt='Chicho'
              className='mx-auto w-60'
            />
          </div>
        </section>
  
          {/* Sobre Nosotros */}
        <section className='bg-gradient-to-r from-blue-50 to-purple-50 py-12'>
          <div className='mx-auto max-w-7xl text-center'>
            <h2 className='mb-6 text-3xl font-bold'>Sobre Nosotros</h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg'>
              Somos un grupo de estudiantes y amigos... AGUS!. Creemos que
              gestionar el tiempo de estudio puede ser divertido y efectivo, y
              por eso creamos CapyFocus.
            </p>

            <div className='mb-8 flex justify-center space-x-6'>
              <img
                src='./FotosLanding/presentandoCapyfocus2.jpg'
                alt='Foto del equipo 1'
                className='h-44 w-44 rounded-full object-cover shadow-lg'
              />
              <img
                src='./FotosLanding/amigos.png'
                alt='Foto del equipo 2'
                className='h-44 w-44 rounded-full object-cover shadow-lg'
              />
              <img
                src='./FotosLanding/Chicho.png'
                alt='Foto del equipo 3'
                className='h-44 w-44 rounded-full object-cover shadow-lg'
              />
            </div>

            <p className='text-lg'>
              Nuestro objetivo es ayudarte a organizar tu estudio de la mejor
              manera posible. ¡Estamos aquí para acompañarte en cada paso del
              camino!
            </p>
          </div>
        </section>

        <footer className='bg-gray-100 p-6 text-center'>
          <p>&copy; 2024 CapyFocus. Todos los derechos reservados a ZTMN.</p>
        </footer>
      </div>
    </div>
  )
}
