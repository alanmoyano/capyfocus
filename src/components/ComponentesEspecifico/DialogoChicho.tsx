export default function DialogoChicho({ dialogo }: { dialogo: string }) {
  return (
    <>
    <div className="relative bg-white text-gray-800 p-4 rounded-lg shadow-md max-w-xs border-gray-700">
      Hola soy Chicho, estoy aprendiendo a hablar!

      <div className="absolute left-1/2 transform translate-x-[10px] bottom-[-10px]">
        <div className="relative">
          {/* Triángulo con bordes oscuros */}
          <div className="absolute border-[11px] border-transparent border-t-gray-800 -top-[10px]"></div>
          {/* Triángulo blanco más pequeño dentro del anterior */}
          <div className="absolute border-[8px] border-transparent border-t-white -top-[9px] -right-[19px]"></div>
        </div>
      </div>
    </div>
    </>
  )
}
