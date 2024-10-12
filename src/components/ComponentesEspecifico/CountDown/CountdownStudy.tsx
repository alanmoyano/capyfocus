import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { formatTime } from '@/lib/utils'

export default function CountdownStudy({
  studyTime,
  play,
  num,
}: {
  studyTime: number
  play: boolean
  num: number
}) {
  return (
    <div>
      <CountdownCircleTimer
        isPlaying={play}
        duration={studyTime} //Aca va el tiempo en segundos
        colors={['#7fb283', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[10, 6, 3, 0]}
        size={250}
        strokeWidth={13}
      >
        {({ remainingTime }) => (
          <div className='text-center'>
            <p>Estudiando</p>
            <div className='text-5xl font-semibold'>
              {formatTime(remainingTime)}
            </div>
            <p className='text-xl'>{Math.floor(num)}</p>
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  )
}
