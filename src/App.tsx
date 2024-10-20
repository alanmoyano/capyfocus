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
import { PostHogProvider } from 'posthog-js/react'
import LandingPage from './components/LandingPage'
import { useLocation } from 'wouter'

function App() {
  const [location] = useLocation();


  return (
    <ThemeProvider defaultTheme='light' storageKey='theme'>
      <SpeedInsights />
      <Analytics />
      <PostHogProvider
        options={{
          api_host: import.meta.env.VITE_POSTHOG_API_URL,
          ui_host: import.meta.env.VITE_POSTHOG_HOST,
        }}
        apiKey={import.meta.env.VITE_POSTHOG_KEY}
      >
        <SessionProvider>
          <ProfilePicProvider>
            <ObjetivosProvider>
              <MotivationProvider>
                <SesionProvider>
                  <MusicProvider>
                    <EventsProvider>
                      {location !== '/landing' && <Navbar />}

                      <Helmet>
                        <title>Capyfocus</title>
                      </Helmet>

                      <main>
                        <Switch>
                        <Route path='/landing'>
                            <LandingPage />
                          </Route>
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

                          <Route path='/brenda'>
                            <ExperimentandoBrenda />
                          </Route>

                          <Route
                            path='/capyInsignias'
                            component={CapyInsignias}
                          />
                          <Route
                            path='/capyEstadisticas'
                            component={CapyEstadisticas}
                          />

                          <Route path='/usuario' component={Usuario} />

                          <Route path='/prueba' component={Prueba} />

                          <Route>
                            <NotFound />
                          </Route>
                        </Switch>
                      </main>

                      <Toaster richColors closeButton />
                    </EventsProvider>
                  </MusicProvider>
                </SesionProvider>
              </MotivationProvider>
            </ObjetivosProvider>
          </ProfilePicProvider>
        </SessionProvider>
      </PostHogProvider>
    </ThemeProvider>
  )
}

export default App
