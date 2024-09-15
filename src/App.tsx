import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

import { Route, Switch } from 'wouter'

import Login from './components/Login'
import Pomodoro from './components/Pomodoro'
import Timer from './components/Timer'
import Badges from './components/Badges'
import Navbar from './components/Navbar'
import { ThemeProvider } from './components/providers/ThemeProvider'
import { ObjetivosProvider } from './components/ObjetivosContext'
import Inicio from './components/Inicio'
import CapyEstadisticas from './components/CapyEstadisticas'
import Usuario from './components/Usuario'
import { MotivationProvider } from './components/MotivationContext'
import { MusicProvider } from './components/MusicContext'
import PruebaTabla from './components/PruebaTabla'

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='theme'>
      <SpeedInsights />
      <Analytics />
      <ObjetivosProvider>
        <MotivationProvider>
          <MusicProvider>
            <Navbar />

            <main>
              <Switch>
                <Route path='/'>
                  <Inicio />
                </Route>

                <Route path='/tablas' component={PruebaTabla} />
                <Route path='/login' component={Login} />

                <Route path='/capydoro'>
                  <Pomodoro />
                </Route>
                <Route path='/capymetro'>
                  <Timer />
                </Route>

                <Route path='/capyInsignias' component={Badges} />
                <Route path='/capyEstadisticas' component={CapyEstadisticas} />

                <Route path='/usuario' component={Usuario} />

                <Route>404!</Route>
              </Switch>
            </main>
          </MusicProvider>
        </MotivationProvider>
      </ObjetivosProvider>
    </ThemeProvider>
  )
}

export default App
