import { SpeedInsights } from '@vercel/speed-insights/react'

import { Link, Route, Switch } from 'wouter'

import Login from './components/Login'
import SignUp from './components/SignUp'
import Pomodoro from './components/Pomodoro'
import Timer from './components/Timer'
import Badges from './components/Badges'
// import Navbar from './components/Navbar'
import { ThemeProvider } from './components/providers/ThemeProvider'

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='theme'>
      <SpeedInsights />

      {/* <Navbar /> */}

      <Route
        path='/'
        component={() => (
          <>
            <h1>hola!</h1>
            <Link to='/login' className='font-bold text-primary'>
              Login
            </Link>
          </>
        )}
      />

      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/signup' component={SignUp} />

        <Route path='/pomodoro' component={Pomodoro} />
        <Route path='/timer' component={Timer} />

        <Route path='/badges' component={Badges} />

        <Route>404!</Route>
      </Switch>
    </ThemeProvider>
  )
}

export default App
