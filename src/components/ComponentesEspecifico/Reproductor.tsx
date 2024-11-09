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
  const test = true

  return (
    <>
      {test ? (
        <img src={src.split('.')[0].concat('.avif')} />
      ) : (
        <video
          autoPlay
          playsInline
          muted
          loop
          className={cn('aspect-auto', className)}
        >
          <source src={src.split('.')[0].concat('.mp4')} />
          <source src={src.split('.')[0].concat('.mov')} />
          <source src={src} />
        </video>
      )}
    </>
  )
}
