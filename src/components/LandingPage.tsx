import { Button } from '@/components/ui/button'
import { Timer, Hourglass, PawPrint } from 'lucide-react'
import { useLocation } from 'wouter'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'
import Reproductor from './ComponentesEspecifico/Reproductor'

export default function LandingPage() {
  const [, setLocation] = useLocation()

  function handleNavigateInicio() {
    setLocation('/inicio')
  }

  function handleNavigateRegistrar() {
    setLocation('/login')
  }
  return (
    <div className='text-pretty'>
      <div className='bg-white'>
        {/* Comienzo */}
        <section className='bg-gradient-to-r from-yellow-50 to-purple-50 py-12 text-center dark:from-yellow-950 dark:to-slate-900'>
          <h1 className='mb-4 text-5xl font-extrabold text-gray-800 dark:text-white'>
            Optimiza tu tiempo de estudio con{' '}
            <span className='text-[#f2b76a]'>CapyFocus</span>
          </h1>
          <p className='mb-6 text-2xl text-gray-700 dark:text-white'>
            Capydoro y Capymetro, dos técnicas que te ayudarán a lograr tus
            objetivos.
          </p>
          <div className='flex flex-col items-center justify-around gap-4 py-8 sm:flex-row'>
            <div className='max-w-md transform transition-transform duration-300 hover:scale-105'>
              <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
                <span className='flex items-center justify-center gap-2'>
                  <Timer />
                  Capydoro
                </span>
              </h2>
              <p className='text-lg text-gray-600 dark:text-white'>
                Elige tu tiempo de estudio y de descanso, repite para mantener
                el foco.
              </p>
            </div>
            <div className='max-w-md transform transition-transform duration-300 hover:scale-105'>
              <h2 className='mb-2 text-3xl font-bold text-[#f2b76a]'>
                <span className='flex items-center justify-center gap-2'>
                  <Hourglass />
                  Capymetro
                </span>
              </h2>
              <p className='text-lg text-gray-600 dark:text-white'>
                Un cronómetro para medir el tiempo de estudio sin
                interrupciones.
              </p>
            </div>
          </div>
        </section>

        {/* Botones */}
        <section className='flex flex-col items-center justify-center py-8 dark:bg-black'>
          <p className='text-center text-2xl font-semibold text-gray-800 dark:text-white'>
            ¡El momento es ahora! ¿Listo para tomar el control de tu tiempo de
            estudio?
          </p>
          <p className='mt-4 text-center text-lg text-gray-700 dark:text-white'>
            Con cada sesión, te acercas más al éxito. No dejes que el tiempo se
            te escape, ¡haz que cada minuto cuente!
          </p>
          <p className='mt-6 text-center text-lg text-gray-700 dark:text-white'>
            ¿Qué estás esperando? Únete a nosotros y empieza a disfrutar de un
            estudio más productivo y efectivo.
          </p>
          <span className='mt-12 flex w-max flex-col items-center justify-center gap-4 sm:w-full sm:flex-row sm:gap-10'>
            <Button
              type='button'
              variant={'ghost'}
              className='rounded-lg border p-8 text-xl shadow-md transition-all duration-300 hover:shadow-lg'
              onClick={handleNavigateRegistrar}
            >
              Ingresa
            </Button>
            <Button
              className='rounded-lg p-8 text-xl text-white shadow-md transition-all duration-300 hover:shadow-lg'
              onClick={handleNavigateInicio}
            >
              Empieza ahora
            </Button>
          </span>
        </section>

        {/* Eventos y Estadisticas e Insgignias!  */}
        <section className='flex flex-col bg-gradient-to-r from-yellow-50 to-purple-50 py-10 text-center dark:from-yellow-950 dark:to-slate-900'>
          <h2 className='mb-4 text-4xl font-bold text-gray-700 dark:text-white'>
            Crea eventos y alcanza tus metas
          </h2>
          <span className='mb-2 text-lg font-semibold text-gray-600 dark:text-gray-200'>
            ¿Tienes un examen o un proyecto importante?
          </span>
          <p className='mb-6 text-lg text-gray-600 dark:text-gray-200'>
            Con CapyFocus puedes crear eventos y asignarles objetivos
            específicos para estar siempre en control de tu progreso.
          </p>
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              <CarouselItem className='basis-full lg:basis-1/3'>
                <div>
                  <img
                    src='/FotosLanding/eventos3.png'
                    alt='Eventos'
                    className='mx-auto mb-6 h-44 w-[80%] rounded-lg object-cover'
                  />
                  <h3 className='mb-4 text-2xl font-semibold text-gray-700 dark:text-white'>
                    Organiza tus exámenes
                  </h3>
                  <p className='text-lg text-gray-600 dark:text-gray-200'>
                    Define eventos importantes como exámenes o entregas y crea
                    objetivos personalizados.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem className='basis-full lg:basis-1/3'>
                <div>
                  <img
                    src='/FotosLanding/estadisticas.webp'
                    alt='Objetivos'
                    className='mx-auto mb-6 h-44 w-[80%] rounded-lg object-cover'
                  />
                  <h3 className='mb-4 text-2xl font-semibold text-gray-700 dark:text-white'>
                    Sigue tu progreso
                  </h3>
                  <p className='text-lg text-gray-600 dark:text-gray-200'>
                    Asocia objetivos a cada evento y sigue tu evolución en
                    tiempo real.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem className='basis-full lg:basis-1/3'>
                <div>
                  <img
                    src='/FotosLanding/CapyInsignias2.png'
                    alt='Insignia 1'
                    className='mx-auto mb-6 h-44 w-[80%] rounded-lg object-cover'
                  />
                  <h3 className='mb-4 text-2xl font-semibold text-gray-700 dark:text-white'>
                    Desbloquea CapyInsignias
                  </h3>
                  <p className='mb-8 text-lg text-gray-600 dark:text-gray-200'>
                    A medida que avances en tus estudios, irás desbloqueando
                    insignias que representan tu progreso.
                  </p>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className='left-4 lg:hidden' />
            <CarouselNext className='right-4 lg:hidden' />
          </Carousel>
        </section>

        {/* Chicho! */}
        <section className='flex flex-col items-center justify-center p-8 sm:flex-row dark:bg-black'>
          {/* Columna 1 */}
          <div className='sm:ml-16 sm:w-2/3'>
            <p className='text-center text-2xl font-semibold text-gray-800 dark:text-white'>
              ¡Chicho te ayudara a mantenerte enfocado!
            </p>
            <p className='mt-4 text-center text-lg text-gray-700 dark:text-gray-200'>
              Dependiendo de tu estilo de motivación, Chicho puede ser dulce y
              alentador, o firme y directo para que no pierdas el enfoque.
              ¡Elige cómo te hablará y aprovecha cada sesión al máximo!
            </p>
            <p className='mt-4 text-center text-lg text-gray-700 dark:text-gray-200'>
              Ajusta su actitud en tu perfil y disfruta de una experiencia de
              estudio totalmente personalizada con CapyFocus.
            </p>
          </div>

          {/* Columna 2 */}
          <div className='flex text-center sm:w-1/3'>
            <Reproductor
              src='\Chicho\OtrasAcciones\CapyOk'
              className='mx-auto w-60'
            />
          </div>
        </section>

        {/* Sobre Nosotros */}
        <section className='flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 py-12 dark:from-gray-900 dark:to-slate-900'>
          <div className='mx-auto max-w-7xl p-6 text-center'>
            <h2 className='mb-6 text-3xl font-bold'>Sobre Nosotros</h2>

            <div className='flex flex-col-reverse items-center justify-center sm:flex-row'>
              <p className='text-center text-lg sm:mr-10'>
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
              <Reproductor src='\Chicho\Positivo\CapyPiano' className='w-80' />
            </div>

            <div className='mb-8 flex flex-col items-center sm:mr-10 sm:flex-row'>
              <Reproductor src='\Chicho\Positivo\CapyLibro' className='w-80' />
              <p className='mb-8 text-center text-lg'>
                En este equipo, cada uno aporta algo especial. Desde las ideas
                locas, las bromas interminables, hasta la seriedad requerida al
                momento de resolver los problemas que se presentan. Pero al
                final del día, compartimos la creencia de que estudiar no tiene
                por qué ser una tarea solitaria o estresante. Nos gusta pensar
                que eso es lo que hace único a CapyFocus: no es solo una
                plataforma, es el reflejo de nuestro viaje como estudiantes y
                como amigos.
                <br />
                <br />
                Nuestra historia es una de amistad, perseverancia y risas. Y
                aunque las técnicas de estudio fueron nuestra excusa para crear
                CapyFocus, lo que realmente nos impulsó fue el deseo de
                compartir algo auténtico, algo que refleje quiénes somos.
              </p>
            </div>

            <div>
              <h2 className='mt-6 text-3xl font-bold text-[#f2b76a]'>
                ¡Gracias por acompañarnos en esta aventura!{' '}
              </h2>
              <h3 className='mb-8 text-lg'>
                Esperamos que te sientas parte de nuestra pequeña comunidad.
              </h3>
            </div>

            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                <CarouselItem className='basis-1/2 sm:basis-1/3 md:basis-1/4'>
                  <img
                    src='/FotosLanding/ZTMNComiendoAlfajor.webp'
                    alt='Equipo comiendo alfajor'
                    className='h-56 w-56 rounded-lg border-4 border-accent/60 object-cover shadow-lg transition duration-300 hover:scale-105'
                  />
                </CarouselItem>
                <CarouselItem className='basis-1/2 sm:basis-1/3 md:basis-1/4'>
                  <img
                    src='/FotosLanding/presentandoCapyfocus2.webp'
                    alt='Equipo presentando'
                    className='h-56 w-56 rounded-lg border-4 border-accent/60 object-cover shadow-lg transition duration-300 hover:scale-105'
                  />
                </CarouselItem>
                <CarouselItem className='basis-1/2 sm:basis-1/3 md:basis-1/4'>
                  <img
                    src='/FotosLanding/amigos.webp'
                    alt='Equipo en una juntada'
                    className='h-56 w-56 rounded-lg border-4 border-accent/60 object-cover shadow-lg transition duration-300 hover:scale-105'
                  />
                </CarouselItem>
                <CarouselItem className='basis-1/2 sm:basis-1/3 md:basis-1/4'>
                  <img
                    src='/FotosLanding/ZTMNSonriendo.webp'
                    alt='Equipo sonriendo'
                    className='h-56 w-56 rounded-lg border-4 border-accent/60 object-cover shadow-lg transition duration-300 hover:scale-105'
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className='left-4 md:hidden' />
              <CarouselNext className='right-4 md:hidden' />
            </Carousel>
          </div>
        </section>
        {/* Reconocimiento */}
        <section className='flex flex-col items-center justify-center p-8 sm:flex-row dark:bg-black'>
          {/* Columna 1 */}
          <div className='sm:ml-16 sm:w-2/3'>
            <p className='text-left text-2xl font-semibold text-[#2599bc] dark:text-[#a7eaff]'>
              Reconocimientos:
            </p>
            <p className='mb-2 mt-4 text-left text-lg text-gray-700 dark:text-gray-200'>
              Queremos dedicar este espacio a reconocer el arduo trabajo de
              nuestras mascotas, que sin pedir nada a cambio, se convierten en
              nuestro soporte emocional, psicólogos, terapeutas y más leales
              compañeros de estudio. Con su presencia nos brindan calma, nos
              arrancan una sonrisa y nos recuerdan que, incluso en los días más
              difíciles, no estamos solos. Son el apoyo silencioso que nos da
              fuerzas para seguir adelante, y la motivación para continuar
              estudiando, ¡para poder darles el mejor alimento! Gracias por ser
              los héroes silenciosos que nos dan fuerzas para seguir adelante.
            </p>
          </div>
        </section>
        {/* Agradecimientos: */}
        <section className='flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 py-12 sm:flex-row dark:from-gray-900 dark:to-slate-900'>
          {/* Columna 1 */}
          <div className='sm:ml-16 sm:w-2/3'>
            <p className='text-left text-2xl font-semibold text-[#2599bc] dark:text-[#a7eaff]'>
              Agradecimientos:
            </p>
            <p className='mb-2 mt-4 text-left text-lg text-gray-700 dark:text-gray-200'>
              Aprovechamos este apartado para agradecer a todas las personas que
              contribuyeron a la realización de este proyecto, como así también
              a los creadores de las imágenes y animaciones utilizados en la
              página que se mencionaran a continuación:
            </p>
            <ul>
              <li className='flex gap-2'>
                <PawPrint className='h-6 w-6' />
                <a
                  href='https://giphy.com/thecapycode'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  The capy code
                </a>
              </li>
              <li></li>
            </ul>
          </div>
        </section>

        <footer className='bg-gray-100 p-6 text-center dark:bg-black'>
          <p>&copy; 2024 CapyFocus. Todos los derechos reservados a ZTMN.</p>
        </footer>
      </div>
    </div>
  )
}
