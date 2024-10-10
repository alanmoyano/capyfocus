import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { formatTime } from '@/lib/utils'
type Mode = 'Estudiando' | 'Descansando'
export default function ExperimentandoBrenda({
  time,
  mode,
  play,
}: {
  time: number
  mode: Mode
  play: boolean
}) {
  return (
    <div>
      
      {mode === 'Estudiando' ? (
        <div>{/* Contados estudiando */}
      <CountdownCircleTimer
        isPlaying={play}
        duration={time} //Aca va el tiempo en segundos
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
          </div>
        )}
      </CountdownCircleTimer>
        
        
        
        </div>
      ) : (
        <div>{/* Contados descansando */}

      <CountdownCircleTimer
        isPlaying
        duration={time} //Aca va el tiempo en segundos
        colors={['#f1aa57', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[10, 6, 3, 0]}
        size={200}
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
      )}

    </div>
  )
}
