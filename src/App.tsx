import { SpeedInsights } from '@vercel/speed-insights/react'

import { Link, Route, Switch } from 'wouter'

import Login from './components/Login'
import SignUp from './components/SignUp'
import Pomodoro from './components/Pomodoro'
import Timer from './components/Timer'
import Badges from './components/Badges'
import Navbar from './components/Navbar'
import { ThemeProvider } from './components/providers/ThemeProvider'

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='theme'>
      <SpeedInsights />

      <Navbar />

      <Switch>
        <Route path='/'>
          <>
            <h1>hola!</h1>
            <Link to='/login' className='font-bold text-primary'>
              Login
            </Link>
          </>
        </Route>

        <Route path='/login' component={Login} />
        <Route path='/signup' component={SignUp} />

        <Route path='/pomodoro'>
          <Pomodoro pomodoroSessions={2} />
        </Route>
        <Route path='/timer'>
          <Timer />
        </Route>

        <Route path='/badges' component={Badges} />

        <Route>404!</Route>
      </Switch>
    </ThemeProvider>
  )
}

export default App
