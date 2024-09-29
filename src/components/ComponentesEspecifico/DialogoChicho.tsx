export default function DialogoChicho({dialogo}: {dialogo: string}) {
  return (
    <>
      <div className='flex w-full justify-end'>
        <div
          className='max-w-xs rounded-lg border border-gray-700 bg-gray-100 p-2 text-white shadow-lg'
          style={{ top: '200px', left: '300px' }}
        >
          <p className='text-gray-700'>
            Hola soy Chicho, estoy aprendiendo a hablar!
          </p>
          <p className='text-gray-700'>{dialogo}</p>
        </div>
      </div>
      <div className='left-96 flex w-11/12 justify-end'>
        <div className='h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-400'></div>
        {/* Interior de la cola */}
        <div
          className='border-l-7 border-r-7 border-t-7 h-0 w-0 border-l-transparent border-r-transparent border-t-gray-700 bg-white'
          style={{}} // Ajuste fino para centrar
        ></div>
      </div>
    </>
  )
}
