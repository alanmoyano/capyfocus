let intervalId: NodeJS.Timeout
let isWorking = true
let workTime: number, restTime: number
let timeLeft: number
let isPaused = false

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
      console.log('me resumieron')
    }
  }

  if (action === 'stop') {
    clearInterval(intervalId)
    isWorking = true
    isPaused = true
    console.log('me detuvieron')
  }

  if (action === 'startBr') {
    startTimer()
  }
  if (action === 'skip') {
    console.log('me skipearon')

    // Clear existing interval
    clearInterval(intervalId)

    // If we're in study time, switch to break
    // workTime = studyTime
    // restTime = breakTime
    timeLeft = breakTime
    isPaused = false
    // isWorking = !isWorking
    // isStopped = false

    startTimer()
  }
}

function startTimer() {
  intervalId = setInterval(() => {
    if (timeLeft < 0) {
      // console.log('entre')
      isWorking = !isWorking
      // console.log('isWorking', isWorking)
      timeLeft = isWorking ? workTime : restTime
      postMessage({ timeLeft, isWorking, isPaused })
    }
    if (!isPaused) {
      timeLeft--
      postMessage({ timeLeft, isWorking, isPaused })
      console.log(timeLeft)
    }
  }, 1000)
}

function startTimer2(restTimer: number) {
  intervalId = setInterval(() => {
    if (timeLeft < 0) {
      isWorking = !isWorking
      timeLeft = restTimer
      postMessage({ timeLeft, isWorking, isPaused })
    }
    if (!isPaused) {
      timeLeft--
      postMessage({ timeLeft, isWorking, isPaused })
      console.log(timeLeft)
    }
  }, 1000)
}
