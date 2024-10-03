// import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Helmet } from 'react-helmet'
import { formatTime } from '@/lib/utils'
// import carpincho from '@/assets/Sonido_de_caripincho.mp3'
// import useSound from 'use-sound'
import useTimer from '@/hooks/useTimer'

export default function Prueba() {
  const {
    studyTime,
    restTime,
    isStudying,
    startStudy,
    pauseStudy,
    resetTimers
  } = useTimer()

  return (
    <>
      <Helmet>
        <title>{`1:${formatTime(studyTime)} - 2:${formatTime(restTime)}`}</title>
      </Helmet>
      <div className='flex flex-col'>
        <div className='flex flex-row items-center justify-center gap-2'>
          <h1 className='text-2xl font-bold'>
            Tiempo de estudio: {formatTime(studyTime)}
          </h1>
          <h1 className='text-2xl font-bold'>
            Tiempo de descanso: {formatTime(restTime)}
          </h1>
        </div>
        <div className='flex flex-row items-center justify-center gap-4'>
          {!isStudying ? (
            <Button onClick={startStudy}>Estudiar</Button>
          ) : (
            <Button onClick={pauseStudy}>Descansar</Button>
          )}
          <Button onClick={resetTimers}>Reset Both Timers</Button>
        </div>
      </div>
    </>
  )
}
