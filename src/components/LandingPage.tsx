import { Button } from '@/components/ui/button'
import { Timer, Hourglass } from 'lucide-react'
import { useLocation } from 'wouter'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

export default function LandingPage() {
  const [, setLocation] = useLocation()

  function handleNavigateInicio() {
    setLocation('/inicio')
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
        {/* <section className='bg-gradient-to-r from-yellow-50 to-purple-50 py-12 text-center'>
          <h1 className='mb-4 text-5xl font-extrabold text-gray-800'>
            Optimiza tu tiempo de estudio con{' '}
            <span className='text-[#f2b76a]'>CapyFocus</span>
          </h1>
          <p className='mb-6 text-2xl text-gray-700'>
            Capydoro y Capymetro, dos técnicas que te ayudarán a lograr tus
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
        </section> */}

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

        {/* Eventos y Estadisticas e Insgignias!  */}
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
            <div className='max-w-sm transform rounded-lg bg-accent/60 p-1 shadow-xl transition duration-300 hover:scale-105'>
              <img
                src='/FotosLanding/eventos2.png'
                alt='Eventos'
                className='mx-auto mb-6 h-44 w-full rounded-lg object-cover'
              />
              <h3 className='mb-4 text-2xl font-semibold text-gray-700'>
                Organiza tus exámenes
              </h3>
              <p className='text-lg text-gray-600'>
                Define eventos importantes como exámenes o entregas y crea
                objetivos personalizados.
              </p>
            </div>
            <div className='max-w-sm transform rounded-lg bg-accent/60 p-1 shadow-xl transition duration-300 hover:scale-105'>
              <img
                src='/FotosLanding/estadisticas.png'
                alt='Objetivos'
                className='mx-auto mb-6 h-44 w-full rounded-lg object-cover'
              />
              <h3 className='mb-4 text-2xl font-semibold text-gray-700'>
                Sigue tu progreso
              </h3>
              <p className='text-lg text-gray-600'>
                Asocia objetivos a cada evento y sigue tu evolución en tiempo
                real.
              </p>
            </div>
            <div className='max-w-sm transform rounded-lg bg-accent/60 p-1 shadow-xl transition duration-300 hover:scale-105'>
              <img
                src='\FotosLanding\CapyInsignias.png'
                alt='Insignia 1'
                className='mx-auto mb-6 h-44 w-full rounded-lg object-cover'
              />
              <h3 className='mb-4 text-2xl font-semibold text-gray-700'>
                Desbloquea CapyInsignias
              </h3>
              <p className='mb-8 text-lg text-gray-600'>
                A medida que avances en tus estudios, irás desbloqueando
                insignias que representan tu progreso.
              </p>
            </div>
          </div>
        </section>

        {/* Chicho! */}
        <section className='my-16 flex items-center justify-center'>
          {/* Columna 1 */}
          <div className='ml-16 w-2/3 text-left'>
            <p className='text-center text-2xl font-semibold text-gray-800'>
              ¡Chicho te ayudara a mantenerte enfocado!
            </p>
            <p className='mt-4 text-center text-lg text-gray-700'>
              Dependiendo de tu estilo de motivación, Chicho puede ser dulce y
              alentador, o firme y directo para que no pierdas el enfoque.
              ¡Elige cómo te hablará y aprovecha cada sesión al máximo!
            </p>
            <p className='mt-4 text-center text-lg text-gray-700'>
              Ajusta su actitud en tu perfil y disfruta de una experiencia de
              estudio totalmente personalizada con CapyFocus.
            </p>
          </div>

          {/* Columna 2 */}
          <div className='flex w-1/3 text-center'>
            <img
              src='\Chicho\OtrasAcciones\CapyOk.gif'
              alt='Chicho'
              className='mx-auto w-60'
            />
          </div>
        </section>

        {/* Sobre Nosotros */}
        <section className='bg-gradient-to-r from-blue-50 to-purple-50 py-12'>
          <div className='mx-auto max-w-7xl p-6 text-center'>
            <h2 className='mb-6 text-3xl font-bold'>Sobre Nosotros</h2>

            <div className='mb-8 flex items-center justify-center'>
              <p className='mr-10 text-center text-lg'>
                CapyFocus nació de un grupo de amigos estudiantes. Nos conocimos
                mientras estudiábamos, y pronto descubrimos que teníamos un
                desafío en común: encontrar una forma eficiente y llevadera de
                gestionar nuestro tiempo de estudio.
                <br />
                <br />
                Además de estudiar, algo que nos une es nuestra debilidad con
                los capybaras. Son animales tranquilos, sociables y con un
                carisma particular, ¡perfectos para inspirar nuestro proyecto!
                Así nació <span className='font-bold'>Chicho</span>, una
                representación de esa filosofía capybara que combina
                compañerismo, humor y un toque de picardía.
                <br />
                <br />
                Para nosotros, Chicho no es solo una mascota virtual: es un
                recordatorio de que podemos tomarnos las cosas con calma,
                disfrutar el proceso y acompañarnos mutuamente en el camino.
              </p>
              <img
                src='\Chicho\Positivo\CapyPiano.gif'
                alt='Chicho'
                className='w-80'
              />
            </div>

            <div className='mb-8 mr-10 flex items-center'>
              <img
                src='\Chicho\Positivo\CapyLibro.gif'
                alt='Chicho'
                className='w-80'
              />
              <p className='mb-8 text-center text-lg'>
                En este equipo, cada uno aporta algo especial. Desde las ideas
                locas, las bromas interminables, hasta la seriedad requerida al
                momento de resolver los problemas que se presentan. Pero al
                final del día, compartimos la creencia de que estudiar no tiene
                por qué ser una tarea solitaria o estresante. Nos gusta pensar
                que eso es lo que hace único a CapyFocus: no es solo una
                plataforma, es el reflejo de nuestro viaje como estudiantes y
                como amigos. <br />
                <br />
                Nuestra historia es una de amistad, perseverancia y risas. Y
                aunque las técnicas de estudio fueron nuestra excusa para crear
                CapyFocus, lo que realmente nos impulsó fue el deseo de
                compartir algo auténtico, algo que refleje quiénes somos.
              </p>
            </div>

            <h2 className='mt-6 text-2xl font-bold text-[#f2b76a]'>
              ¡Gracias por acompañarnos en esta aventura!{' '}
            </h2>
            <h2 className='mb-8 text-lg'>
              Esperamos que te sientas parte de nuestra pequeña comunidad.
            </h2>

            <Carousel>
              <CarouselContent>
                <CarouselItem className='basis-1/2 lg:basis-1/4'>
                  <img
                    src='./FotosLanding/ZTMNComiendoAlfajor.jpg'
                    alt='Equipo comiendo alfajor'
                    className='v h-56 w-56 rounded-lg border-accent/60 object-cover shadow-lg transition duration-300 hover:scale-105'
                  />
                </CarouselItem>
                <CarouselItem className='basis-1/2 lg:basis-1/4'>
                  <img
                    src='./FotosLanding/presentandoCapyfocus2.jpg'
                    alt='Equipo presentando'
                    className='h-56 w-56 rounded-lg border-4 border-accent/60 object-cover shadow-lg transition duration-300 hover:scale-105'
                  />
                </CarouselItem>
                <CarouselItem className='basis-1/2 lg:basis-1/4'>
                  <img
                    src='./FotosLanding/amigos.png'
                    alt='Equipo en una juntada'
                    className='h-56 w-56 rounded-lg border-4 border-accent/60 object-cover shadow-lg transition duration-300 hover:scale-105'
                  />
                </CarouselItem>
                <CarouselItem className='basis-1/2 lg:basis-1/4'>
                  <img
                    src='./FotosLanding/ZTMNSonriendo.jpg'
                    alt='Equipo sonriendo'
                    className='h-56 w-56 rounded-lg border-4 border-accent/60 object-cover shadow-lg transition duration-300 hover:scale-105'
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className='-left-8' />
              <CarouselNext className='-right-8' />
            </Carousel>
          </div>
        </section>

        <footer className='bg-gray-100 p-6 text-center'>
          <p>&copy; 2024 CapyFocus. Todos los derechos reservados a ZTMN.</p>
        </footer>
      </div>
    </div>
  )
}
