import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { formatTime } from '@/lib/utils'

export default function CountdownStudy({ breakTime, play }: { breakTime: number, play: boolean}) {


  return (
    <div>
      <CountdownCircleTimer
        isPlaying={play}
        duration={breakTime} //Aca va el tiempo en segundos
        colors={['#96afb3', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[10, 6, 3, 0]}
        size={250}
        strokeWidth={13}
      >
        {({ remainingTime }) => (
          <div className='text-center'>
            <p>Descansando</p>
            <div className='text-5xl font-semibold'>
              {formatTime(remainingTime)}
              
            </div>
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  )
}
