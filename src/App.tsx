import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

import { Route, Switch } from 'wouter'

import Login from './components/Login'
import SignUp from './components/SignUp'
import Pomodoro from './components/Pomodoro'
import Timer from './components/Timer'
import Badges from './components/Badges'
import Navbar from './components/Navbar'
import { ThemeProvider } from './components/providers/ThemeProvider'
import Inicio from './components/Inicio'
import CapyEstadisticas from './components/CapyEstadisticas'
import Usuario from './components/Usuario'

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='theme'>
      <SpeedInsights />
      <Analytics />

      <Navbar />

      <main>
        <Switch>
          <Route path='/'>
            <Inicio />
          </Route>

          <Route path='/login' component={Login} />
          <Route path='/signup' component={SignUp} />

          <Route path='/capydoro'>
            <Pomodoro pomodoroSessions={1} />
          </Route>
          <Route path='/capymetro'>
            <Timer />
          </Route>

          <Route path='/capyInsignias' component={Badges} />
          <Route path='/capyEstadisticas' component={CapyEstadisticas}/>

          <Route path='/usuario' component={Usuario}/>


          <Route>404!</Route>
        </Switch>
      </main>
    </ThemeProvider>
  )
}

export default App
