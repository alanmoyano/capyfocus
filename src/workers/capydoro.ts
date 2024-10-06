// pomodoro.js (Web Worker)

let intervalId: NodeJS.Timeout
let isWorking = true
let workTime: number, breakTime: number
let timeLeft: number
let isPaused = false // Nueva variable para pausar el temporizador

type props = {
  action: string
  studyTime: number
  restTime: number
}

onmessage = function (e) {
  const { action, studyTime, restTime } = e.data as props

  if (action === 'start') {
    workTime = studyTime
    breakTime = restTime
    timeLeft = workTime
    isPaused = false

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
    postMessage({ action: 'stopped' })
  }
}

function startTimer() {
  intervalId = setInterval(() => {
    if (!isPaused) {
      timeLeft--
      postMessage({ timeLeft, isWorking })

      if (timeLeft <= 0) {
        isWorking = !isWorking
        timeLeft = isWorking ? workTime : breakTime
        postMessage({ timeLeft, isWorking })
      }
    }
  }, 1000)
}
