import { useLocation } from "wouter"

export default function ExperimentandoBrenda() {
const [, setLocation] = useLocation()

function handleNavigate() {
  setLocation('/')
}

  return (
    <div>
<div className="bg-white">

  <header className="flex justify-end items-center p-6">
    <nav className="space-x-4">
      <a href="/login" className="text-lg text-gray-600">Iniciar sesión</a>
      <a href="/login" className="bg-primary text-white px-4 py-2 rounded-lg">Regístrate</a>
    </nav>
  </header>

{/* Comienzo */}
  <section className="text-center my-10">
    <h1 className="text-4xl font-bold mb-4">Optimiza tu tiempo de estudio con CapyFocus</h1>
    <p className="text-xl mb-6">Capydoros y Capymetro, dos técnicas que te ayudarán a lograr tus objetivos.</p>
    <a href="/" className="bg-primary text-white px-8 py-4 rounded-lg text-lg">Empieza ahora</a>
  </section>


  <section className="flex justify-around my-16">
    <div className="max-w-md">
      <h2 className="text-2xl font-semibold mb-2">Capydoros</h2>
      <p className="text-lg">Basado en la técnica pomodoro, para sesiones de estudio eficientes.</p>
    </div>
    <div className="max-w-md">
      <h2 className="text-2xl font-semibold mb-2">Capymetro</h2>
      <p className="text-lg">Un cronómetro para medir el tiempo de estudio sin interrupciones.</p>
    </div>
  </section>

{/* Eventos y Estadisticas */}

<section className="bg-gray-100 py-10 text-center">
  <h2 className="text-3xl font-bold mb-4">Crea eventos y alcanza tus metas</h2>
  <p className="text-lg mb-6">
    ¿Tienes un examen o un proyecto importante? Con CapyFocus puedes crear eventos y asignarles objetivos específicos para estar siempre en control de tu progreso.
  </p>
  <div className="flex justify-center space-x-6">
    <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
      <img src="public/FotosLanding/eventos.png" alt="Eventos" className="mx-auto mb-6 w-full h-40 object-cover" />
      <h3 className="text-2xl font-semibold mb-4">Organiza tus exámenes</h3>
      <p className="text-lg">Define eventos importantes como exámenes o entregas y crea objetivos personalizados.</p>
    </div>
    <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
      <img src="public/FotosLanding/estadisticas.png" alt="Objetivos" className="mx-auto mb-6 w-full h-40 object-cover" />
      <h3 className="text-2xl font-semibold mb-4">Sigue tu progreso</h3>
      <p className="text-lg">Asocia objetivos a cada evento y sigue tu evolución en tiempo real.</p>
    </div>
    <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
      <img src="public\FotosLanding\CapyInsignias.png" alt="Insignia 1" className="mx-auto mb-6 w-full h-40 object-cover" />
      <h3 className="text-2xl font-semibold mb-4">Desbloquea CapyInsignias</h3>
      <p className="text-lg">A medida que avances en tus estudios, irás desbloqueando insignias que representan tu progreso.</p>
    </div>
  </div>
</section>




  <section className="my-16 text-center">
    <img src="public\Chicho\OtrasAcciones\CapyOk.gif" alt="Chicho" className="mx-auto w-32" />
    <div className="mt-4">
      <p className="text-lg">¡Chicho te ayudará a mantenerte enfocado!</p>
    </div>
  </section>


  <section className="bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        Somos un grupo de estudiantes y amigos... AGUS!. Creemos que gestionar el tiempo de estudio puede ser divertido y efectivo, y por eso creamos CapyFocus.
      </p>

      <div className="flex justify-center space-x-6 mb-8">
        <img src="" alt="Foto del equipo 1" className="w-32 h-32 rounded-full object-cover shadow-lg" />
        <img src="" alt="Foto del equipo 2" className="w-32 h-32 rounded-full object-cover shadow-lg" />
        <img src="" alt="Foto del equipo 3" className="w-32 h-32 rounded-full object-cover shadow-lg" />
      </div>

      <p className="text-lg">
        Nuestro objetivo es ayudarte a organizar tu estudio de la mejor manera posible. ¡Estamos aquí para acompañarte en cada paso del camino!
      </p>
    </div>
  </section>

  <footer className="bg-gray-100 p-6 text-center">
    <p>&copy; 2024 CapyFocus. Todos los derechos reservados a ZTMN.</p>
  </footer>
</div>
    </div>
  )
}
