// timerWorker.js
let timer1 = 0
let timer2 = 0
let intervalId1
let intervalId2

onmessage = function (e) {
  if (e.data === 'startTimer1') {
    intervalId1 = setInterval(() => {
      timer1++
      postMessage({ timer1, timer2 })
    }, 1000)
    clearInterval(intervalId2)
  } else if (e.data === 'pauseTimer1') {
    clearInterval(intervalId1)
    intervalId2 = setInterval(() => {
      timer2++
      postMessage({ timer1, timer2 })
    }, 1000)
  }
  //  else if (e.data === 'pauseTimer2') {
  //   clearInterval(intervalId2)
  // }
  else if (e.data === 'reset') {
    timer1 = 0
    timer2 = 0
    clearInterval(intervalId1)
    clearInterval(intervalId2)
    postMessage({ timer1, timer2 })
  }
}
