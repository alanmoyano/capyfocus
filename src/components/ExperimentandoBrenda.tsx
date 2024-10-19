import { useLocation } from 'wouter'

export default function ExperimentandoBrenda() {
  const [, setLocation] = useLocation()

  function handleNavigate() {
    setLocation('/')
  }

  return (
    <div>
      <div className='bg-white'>
        <header className='flex items-center justify-end p-6'>
          <nav className='space-x-4'>
            <a href='/login' className='text-lg text-gray-600'>
              Iniciar sesión
            </a>
            <a
              href='/login'
              className='rounded-lg bg-primary px-4 py-2 text-white'
            >
              Regístrate
            </a>
          </nav>
        </header>

        {/* Comienzo */}
        <section className='my-10 text-center'>
          <h1 className='mb-4 text-4xl font-bold'>
            Optimiza tu tiempo de estudio con CapyFocus
          </h1>
          <p className='mb-6 text-xl'>
            Capydoros y Capymetro, dos técnicas que te ayudarán a lograr tus
            objetivos.
          </p>
          <a
            href='/'
            className='rounded-lg bg-primary px-8 py-4 text-lg text-white'
          >
            Empieza ahora
          </a>
        </section>

        <section className='my-16 flex justify-around'>
          <div className='max-w-md'>
            <h2 className='mb-2 text-2xl font-semibold'>Capydoros</h2>
            <p className='text-lg'>
              Basado en la técnica pomodoro, para sesiones de estudio
              eficientes.
            </p>
          </div>
          <div className='max-w-md'>
            <h2 className='mb-2 text-2xl font-semibold'>Capymetro</h2>
            <p className='text-lg'>
              Un cronómetro para medir el tiempo de estudio sin interrupciones.
            </p>
          </div>
        </section>

        {/* Eventos y Estadisticas */}

        <section className='bg-gray-100 py-10 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>
            Crea eventos y alcanza tus metas
          </h2>
          <p className='mb-6 text-lg'>
            ¿Tienes un examen o un proyecto importante? Con CapyFocus puedes
            crear eventos y asignarles objetivos específicos para estar siempre
            en control de tu progreso.
          </p>
          <div className='flex justify-center space-x-6'>
            <div className='max-w-sm transform rounded-lg bg-white p-6 shadow-lg transition duration-300 hover:scale-105'>
              <img
                src='public/FotosLanding/eventos.png'
                alt='Eventos'
                className='mx-auto mb-6 h-40 w-full object-cover'
              />
              <h3 className='mb-4 text-2xl font-semibold'>
                Organiza tus exámenes
              </h3>
              <p className='text-lg'>
                Define eventos importantes como exámenes o entregas y crea
                objetivos personalizados.
              </p>
            </div>
            <div className='max-w-sm transform rounded-lg bg-white p-6 shadow-lg transition duration-300 hover:scale-105'>
              <img
                src='public/FotosLanding/estadisticas.png'
                alt='Objetivos'
                className='mx-auto mb-6 h-40 w-full object-cover'
              />
              <h3 className='mb-4 text-2xl font-semibold'>Sigue tu progreso</h3>
              <p className='text-lg'>
                Asocia objetivos a cada evento y sigue tu evolución en tiempo
                real.
              </p>
            </div>
            <div className='max-w-sm transform rounded-lg bg-white p-6 shadow-lg transition duration-300 hover:scale-105'>
              <img
                src='public\FotosLanding\CapyInsignias.png'
                alt='Insignia 1'
                className='mx-auto mb-6 h-40 w-full object-cover'
              />
              <h3 className='mb-4 text-2xl font-semibold'>
                Desbloquea CapyInsignias
              </h3>
              <p className='text-lg'>
                A medida que avances en tus estudios, irás desbloqueando
                insignias que representan tu progreso.
              </p>
            </div>
          </div>
        </section>

        <section className='my-16 text-center'>
          <img
            src='public\Chicho\OtrasAcciones\CapyOk.gif'
            alt='Chicho'
            className='mx-auto w-32'
          />
          <div className='mt-4'>
            <p className='text-lg'>¡Chicho te ayudará a mantenerte enfocado!</p>
          </div>
        </section>

        <section className='bg-gray-50 py-12'>
          <div className='mx-auto max-w-7xl text-center'>
            <h2 className='mb-6 text-3xl font-bold'>Sobre Nosotros</h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg'>
              Somos un grupo de estudiantes y amigos... AGUS!. Creemos que
              gestionar el tiempo de estudio puede ser divertido y efectivo, y
              por eso creamos CapyFocus.
            </p>

            <div className='mb-8 flex justify-center space-x-6'>
              <img
                src=''
                alt='Foto del equipo 1'
                className='h-32 w-32 rounded-full object-cover shadow-lg'
              />
              <img
                src=''
                alt='Foto del equipo 2'
                className='h-32 w-32 rounded-full object-cover shadow-lg'
              />
              <img
                src=''
                alt='Foto del equipo 3'
                className='h-32 w-32 rounded-full object-cover shadow-lg'
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
