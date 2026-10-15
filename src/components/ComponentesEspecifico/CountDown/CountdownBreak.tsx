import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { formatTime } from '@/lib/utils'

// `remainingTime` viene del worker y es la fuente de verdad del texto.
// El anillo se resincroniza al remontar el componente con una `key` nueva.
export default function CountdownBreak({
  breakTime,
  play,
  num,
  remainingTime,
}: {
  breakTime: number
  play: boolean
  num: number
  remainingTime?: number
}) {
  const restante =
    remainingTime === undefined
      ? undefined
      : Math.min(Math.max(remainingTime, 0), breakTime)

  return (
    <div>
      <CountdownCircleTimer
        isPlaying={play}
        duration={breakTime} //Aca va el tiempo en segundos
        initialRemainingTime={restante}
        colors={['#96afb3', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[10, 6, 3, 0]}
        size={250}
        strokeWidth={13}
      >
        {({ remainingTime: restanteAnillo }) => (
          <div className='text-center'>
            <p>Descansando</p>
            <div className='text-5xl font-semibold'>
              {formatTime(restante ?? restanteAnillo)}
            </div>
            <p className='text-xl'>{Math.floor(num)}</p>
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  )
}
