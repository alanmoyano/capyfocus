/**
 * Acá van los videos en webm, NO en gif!!!
 */
export default function Reproductor({
  src,
  className
}: {
  src: `${string}.webm`
  className?: string
}) {
  return (
    <video autoPlay playsInline muted loop src={src} className={className} />
  )
}
