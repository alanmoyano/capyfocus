// pomodoro.js (Web Worker)

let intervalId: NodeJS.Timeout
let isWorking = true
let workTime: number, restTime: number
let timeLeft: number
let isPaused = false // Nueva variable para pausar el temporizador
// let isStopped = false // Variable de control para gestionar el stop

type props = {
  action: string
  studyTime: number
  breakTime: number
}

onmessage = function (e) {
  const { action, studyTime, breakTime } = e.data as props

  if (action === 'start') {
    workTime = studyTime
    restTime = breakTime
    timeLeft = workTime
    isPaused = false
    // isStopped = false

    startTimer()
  }

  if (action === 'pause') {
    isPaused = true
    clearInterval(intervalId) // Detener el intervalo sin reiniciar
    console.log('me pausaron')
  }

  if (action === 'resume') {
    if (isPaused) {
      isPaused = false
      startTimer()
    }
    console.log('me resumieron')
  }

  if (action === 'stop') {
    clearInterval(intervalId)
    isWorking = true
    console.log('me detuvieron')
  }

  if (action === 'startBr') {
    startTimer()
  }
}

function startTimer() {
  intervalId = setInterval(() => {
    if (!isPaused) {
      timeLeft--
      postMessage({ timeLeft, isWorking })
      console.log(timeLeft)
      if (timeLeft < 0) {
        isWorking = !isWorking
        timeLeft = isWorking ? workTime : restTime
        postMessage({ timeLeft, isWorking })
      }
    }
  }, 1000)
}
