import { cn } from '@/lib/utils'

export default function Reproductor({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <img src={src.concat('.gif')} className={cn('aspect-auto', className)} />
  )
}
