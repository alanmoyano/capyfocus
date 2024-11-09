import { cn } from '@/lib/utils'

/**
 * Acá van los videos en webm, NO en gif!!!
 */
export default function Reproductor({
  src,
  className,
}: {
  src: `${string}.webm`
  className?: string
}) {
  return (
    <video
      autoPlay
      playsInline
      muted
      loop
      className={cn('aspect-auto', className)}
    >
      <source src={src.split('.')[0].concat('.mov')} />
      <source src={src} />
    </video>
  )
}
