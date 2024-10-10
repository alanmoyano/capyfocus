import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

import { Route, Switch } from 'wouter'

import Login from './components/AuthForm'
import GoogleTest from './components/GoogleTest'
import Pomodoro from './components/Pomodoro'
import Timer from './components/Timer'
import CapyInsignias from './components/CapyInsignias'
import Navbar from './components/Navbar'
import { ThemeProvider } from './components/contexts/ThemeContext'
import { ObjetivosProvider } from './components/contexts/ObjetivosContext'
import Inicio from './components/Inicio'
import CapyEstadisticas from './components/CapyEstadisticas'
import Usuario from './components/Usuario'
import { MotivationProvider } from './components/contexts/MotivationContext'
import { MusicProvider } from './components/contexts/MusicContext'
import { SesionProvider } from './components/contexts/SesionContext'
import { Helmet } from 'react-helmet'
import NotFound from './components/NotFound'
import Prueba from './components/Prueba'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='theme'>
      <SpeedInsights />
      <Analytics />
      <ObjetivosProvider>
        <MotivationProvider>
          <SesionProvider>
            <MusicProvider>
              <Navbar />

              <Helmet>
                <title>Capyfocus</title>
              </Helmet>

              <main>
                <Switch>
                  <Route path='/'>
                    <Inicio />
                  </Route>
                  <Route path='/login' component={Login} />

                  <Route path='/capydoro'>
                    <Pomodoro />
                  </Route>
                  <Route path='/capymetro'>
                    <Timer />
                  </Route>

                  <Route path='/capyInsignias' component={CapyInsignias} />
                  <Route
                    path='/capyEstadisticas'
                    component={CapyEstadisticas}
                  />

                  <Route path='/usuario' component={Usuario} />

                  <Route path='/prueba' component={Prueba} />
                  <Route path='/calprugon'>
                    <GoogleTest />
                  </Route>
                  <Route>
                    <NotFound />
                  </Route>
                </Switch>
              </main>

              <Toaster richColors closeButton />
            </MusicProvider>
          </SesionProvider>
        </MotivationProvider>
      </ObjetivosProvider>
    </ThemeProvider>
  )
}

export default App
