import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

import { Route, Switch } from 'wouter'

import Login from './components/AuthForm'
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
import ExperimentandoBrenda from './components/ExperimentandoBrenda'
import { SessionProvider } from './components/contexts/SessionContext'
import { EventsProvider } from './components/contexts/EventsContext'
import { ProfilePicProvider } from './components/contexts/ProfilePicContext'
import LandingPage from './components/LandingPage'
import { PreferencesProvider } from './components/contexts/PreferencesContext'
import { InsigniasProvider } from '@/components/contexts/InsigniasContext'
import DiscordComponent from '@components/DiscordComponent'
import PasswordChange from '@/components/PasswordChange'

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='theme'>
      <SpeedInsights />
      <Analytics />

      <SessionProvider>
        <ProfilePicProvider>
          <PreferencesProvider>
            <ObjetivosProvider>
              <MotivationProvider>
                <SesionProvider>
                  <MusicProvider>
                    <EventsProvider>
                      <InsigniasProvider>
                        <Navbar />

                        <Helmet>
                          <title>Capyfocus</title>
                        </Helmet>

                        <main>
                          <Switch>
                            <Route path='/' component={LandingPage} />
                            <Route path='/inicio' component={Inicio} />
                            <Route path='/login' component={Login} />

                            <Route path='/capydoro' component={Pomodoro} />
                            <Route path='/capymetro' component={Timer} />

                            <Route
                              path='/brenda'
                              component={ExperimentandoBrenda}
                            />

                            <Route
                              path='/discord'
                              component={DiscordComponent}
                            />

                            <Route
                              path='/capyInsignias'
                              component={CapyInsignias}
                            />
                            <Route
                              path='/capyEstadisticas'
                              component={CapyEstadisticas}
                            />

                            <Route path='/usuario' component={Usuario} />

                            <Route
                              path='/cambiarContraseña'
                              component={PasswordChange}
                            />

                            <Route path='/prueba' component={Prueba} />

                            <Route component={NotFound} />
                          </Switch>
                        </main>

                        <Toaster
                          richColors
                          closeButton
                          toastOptions={{}}
                          theme='light'
                        />
                      </InsigniasProvider>
                    </EventsProvider>
                  </MusicProvider>
                </SesionProvider>
              </MotivationProvider>
            </ObjetivosProvider>
          </PreferencesProvider>
        </ProfilePicProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}

export default App
