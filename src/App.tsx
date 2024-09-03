import { SpeedInsights } from '@vercel/speed-insights/react'

import { Route, Switch } from 'wouter'

import Login from './components/Login'
import SignUp from './components/SignUp'
import Pomodoro from './components/Pomodoro'
import Timer from './components/Timer'
import Badges from './components/Badges'
import Navbar from './components/Navbar'
import { ThemeProvider } from './components/providers/ThemeProvider'
import Inicio from './components/Inicio'

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='theme'>
      <SpeedInsights />

      <Navbar />

      <main>
        <Switch>
          <Route path='/'>
            <Inicio />
          </Route>

          <Route path='/login' component={Login} />
          <Route path='/signup' component={SignUp} />

          <Route path='/pomodoro'>
            <Pomodoro pomodoroSessions={1} />
          </Route>
          <Route path='/timer'>
            <Timer />
          </Route>

          <Route path='/badges' component={Badges} />

          <Route>404!</Route>
        </Switch>
      </main>
    </ThemeProvider>
  )
}

export default App
