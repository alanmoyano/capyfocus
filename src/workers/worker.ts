let timer1 = 0
let timer2 = 0
let intervalId1: NodeJS.Timeout
let intervalId2: NodeJS.Timeout

onmessage = function (e) {
  switch (e.data) {
    case 'startTimer1': {
      intervalId1 = setInterval(() => {
        timer1++
        postMessage({ timer1, timer2 })
        console.log(
          `timer1: ${timer1}, timer2: ${timer2} at ${new Date().toLocaleString()}`
        )
      }, 1000)
      clearInterval(intervalId2)
      return
    }
    case 'pauseTimer1': {
      clearInterval(intervalId1)
      intervalId2 = setInterval(() => {
        timer2++
        postMessage({ timer1, timer2 })
        console.log(
          `timer1: ${timer1}, timer2: ${timer2} at ${new Date().toLocaleString()}`
        )
      }, 1000)
      return
    }
    case 'reset': {
      timer1 = 0
      timer2 = 0
      clearInterval(intervalId1)
      clearInterval(intervalId2)
      postMessage({ timer1, timer2 })
      return
    }
    default: {
      console.log('no pasó nada')
      return
    }
  }
}
