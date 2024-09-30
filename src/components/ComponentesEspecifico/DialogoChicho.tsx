export default function DialogoChicho({ dialogo }: { dialogo: string }) {
  return (
    <>
      <div className='flex w-full justify-end'>
        <div
          className='max-w-xs rounded-lg border border-gray-700 bg-gray-100 p-2 text-white shadow-lg'
        >
          <p className='text-gray-700'>
            Hola soy Chicho, estoy aprendiendo a hablar!
          </p>
          <p className='text-gray-700'>{dialogo}</p>
        </div>
      </div>
      <div className=' flex w-11/12 justify-end'>
        <div className='h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-700'></div>      
        <div className='absolute  h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-100'></div>
      </div>




    </>
  )
}
