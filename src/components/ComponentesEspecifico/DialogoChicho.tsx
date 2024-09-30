export default function DialogoChicho({ dialogo }: { dialogo: string }) {
  return (
    <>
    <div className=" w-full flex justify-end ">

      <div className='relative max-w-xs rounded-xl  border-gray-800 border-[2px] bg-gray-100 p-4 text-gray-800 shadow-md'>
        <p>Hola soy Chicho, estoy aprendiendo a hablar!</p>
        <p>{dialogo}</p>
        <div className='absolute bottom-[-10px]  translate-x-[240px] transform'>
          <div className='relative'>
            {/* Triángulo con bordes oscuros */}
            <div className='absolute -top-[10px] border-[11px] border-transparent border-t-gray-800'></div>
            {/* Triángulo blanco más pequeño dentro del anterior */}
            <div className='absolute -right-[19px] -top-[10px] border-[8px] border-transparent border-t-gray-100'></div>
          </div>
    </div>
        </div>
      </div>
    </>
  )
}
