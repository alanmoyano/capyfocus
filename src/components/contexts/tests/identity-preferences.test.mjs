import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { build } from 'esbuild'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'

// Bundle only the contexts. All auth and database operations remain local mocks.
const directory = mkdtempSync(resolve('node_modules', '.capy-context-tests-'))
const entry =
  [
    'Session',
    'Preferences',
    'Theme',
    'Motivation',
    'ProfilePic',
    'Objetivos',
    'Sesion',
    'Events',
    'Insignias',
  ]
    .map(name => `export * from './src/components/contexts/${name}Context.tsx'`)
    .join('\n') +
  `\nexport {default as Usuario} from './src/components/Usuario.tsx'\nexport {default as Switchers} from './src/components/ComponentesEspecifico/Switchers.tsx'`
const bundle = await build({
  stdin: { contents: entry, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime'],
  plugins: [
    {
      name: 'local-backend',
      setup(build) {
        build.onResolve({ filter: /^@hookform\/resolvers\/zod$/ }, () => ({
          path: 'resolver',
          namespace: 'resolver-mock',
        }))
        build.onLoad({ filter: /.*/, namespace: 'resolver-mock' }, () => ({
          contents: 'export const zodResolver = () => undefined',
        }))
        const uiExports =
          'Avatar AvatarFallback AvatarImage Button Card CardContent CardDescription CardFooter CardHeader Input Label ScrollArea Sheet SheetClose SheetContent SheetFooter SheetHeader SheetTitle SheetTrigger Switch Select SelectContent SelectItem SelectTrigger SelectValue'.split(
            ' '
          )
        build.onResolve({ filter: /(?:components|\.\.)\/ui\// }, args => ({
          path: args.path,
          namespace: 'ui-mock',
        }))
        build.onLoad({ filter: /.*/, namespace: 'ui-mock' }, () => ({
          contents:
            `import React from 'react';` +
            uiExports
              .map(
                name =>
                  `export function ${name}(props) { return React.createElement('${name === 'Button' ? 'button' : name.toLowerCase()}', props, props.children) }`
              )
              .join('\n'),
        }))
        build.onResolve(
          { filter: /ChichoHablaPerfil$|FotoSelector$|Reproductor$/ },
          () => ({ path: 'empty', namespace: 'view-mock' })
        )
        build.onLoad({ filter: /.*/, namespace: 'view-mock' }, () => ({
          contents: 'export default function View() { return null }',
        }))
        build.onResolve(
          { filter: /^wouter$|^sonner$|^react-hook-form$/ },
          args => ({ path: args.path, namespace: 'interaction-mock' })
        )
        build.onLoad({ filter: /.*/, namespace: 'interaction-mock' }, args => ({
          contents:
            args.path === 'wouter'
              ? 'export const useLocation = () => ["/usuario", path => globalThis.__contextNavigate(path)]'
              : args.path === 'sonner'
                ? 'export const toast = { error: text => globalThis.__contextErrors.push(text) }'
                : 'const noop = () => {}; export const useForm = () => ({register: () => ({}), handleSubmit: () => noop, watch: () => "Usuario", setValue: noop, formState: {errors: {}}})',
        }))

        build.onResolve({ filter: /supabase\/client$/ }, () => ({
          path: 'supabase',
          namespace: 'mock',
        }))
        build.onResolve({ filter: /supportFunctions$/ }, () => ({
          path: 'events',
          namespace: 'mock',
        }))
        build.onLoad({ filter: /.*/, namespace: 'mock' }, args => ({
          contents:
            args.path === 'supabase'
              ? 'export const supabase = globalThis.__contextBackend'
              : 'export const gatherEventsOfUser = id => globalThis.__contextEvents(id)',
        }))
      },
    },
  ],
})
const bundlePath = resolve(directory, 'contexts.cjs')
writeFileSync(bundlePath, bundle.outputFiles[0].text)
after(() => rmSync(directory, { recursive: true, force: true }))

let auth, requests, values, root, storage, writes
const deferred = () => {
  let resolve
  const promise = new Promise(done => {
    resolve = done
  })
  return { promise, resolve }
}
globalThis.__contextBackend = {
  auth: {
    signOut: () => globalThis.__contextSignOut(),
    onAuthStateChange(callback) {
      auth = callback
      return {
        data: {
          subscription: {
            unsubscribe() {
              auth = undefined
            },
          },
        },
      }
    },
  },
  from(table) {
    const request = { table, ...deferred() }
    const query = {
      select() {
        return query
      },
      update(value) {
        request.update = value
        return query
      },
      eq(column, value) {
        request[column] = value
        return query
      },
      then(onFulfilled, onRejected) {
        requests.push(request)
        return request.promise.then(onFulfilled, onRejected)
      },
    }
    return query
  },
}
globalThis.__contextEvents = id => {
  const request = { table: 'events', id, ...deferred() }
  requests.push(request)
  return request.promise
}
const c = createRequire(import.meta.url)(bundlePath)
const account = id => ({
  user: { id, user_metadata: { name: 'Usuario' } },
  access_token: `token-${id}`,
})
const emit = async (event, session) =>
  act(async () => {
    auth(event, session)
  })
let extraView = null
function Probe() {
  values = {
    auth: c.useSession(),
    preferences: c.usePreferences(),
    motivation: c.useMotivation(),
    objectives: c.useObjetivos(),
    summary: c.useSesion(),
    events: c.useEvents(),
    profile: c.useProfilePic(),
    badges: c.useInsignias(),
  }
  return extraView ? React.createElement(extraView) : null
}
async function mount() {
  await act(async () => {
    root = TestRenderer.create(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(
          c.ThemeProvider,
          null,
          React.createElement(
            c.SessionProvider,
            null,
            [
              c.ProfilePicProvider,
              c.PreferencesProvider,
              c.ObjetivosProvider,
              c.MotivationProvider,
              c.SesionProvider,
              c.EventsProvider,
              c.InsigniasProvider,
            ].reduceRight(
              (child, Provider) => React.createElement(Provider, null, child),
              React.createElement(Probe)
            )
          )
        )
      )
    )
  })
}
beforeEach(() => {
  extraView = null
  globalThis.__contextErrors = []
  globalThis.__contextNavigate = () => {}
  requests = []
  storage = new Map()
  writes = []
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => {
      assert.equal(typeof value, 'string')
      storage.set(key, value)
      writes.push([key, value])
    },
  }
  globalThis.window = {
    document: { documentElement: { classList: { remove() {}, add() {} } } },
  }
})
after(async () => {
  if (root) await act(async () => root.unmount())
})

// Each test releases its own tree to keep subscriptions and effects isolated.
async function unmount() {
  await act(async () => root.unmount())
  root = null
}

test('A → B and external SIGNED_OUT reset all private state; token refresh preserves it', async () => {
  await mount()
  await emit('SIGNED_IN', account('A'))
  await act(async () => {
    values.objectives.setObjetivos(['privado'])
    values.objectives.setObjetivosPend(['pendiente'])
    values.objectives.setObjetivosFav(['favorito'])
    values.objectives.setTiempo({ privado: 5 })
    values.objectives.setTiempoSesion({ privado: 3 })
    values.objectives.setTiempoFavorito({ favorito: 8 })
    values.summary.setTiempoTotal(42)
    values.summary.setCantidadPausas(2)
    values.summary.setAcumuladorTiempoPausa(7)
    values.summary.setBanderaUnicaVez(false)
    values.events.setEvents([{ id: 1 }])
    values.events.setSelectedEvent({ id: 1 })
    values.profile.setProfilePic('A.png')
    values.badges.setInsigniasXUsuario([{ idUsuario: 'A' }])
  })
  const old = values
  const requestCount = requests.length
  await emit('TOKEN_REFRESHED', { ...account('A'), access_token: 'fresh' })
  assert.equal(values.summary.tiempoTotal, 42)
  assert.deepEqual(values.objectives.objetivosFav, ['favorito'])
  assert.equal(requests.length, requestCount)
  await emit('SIGNED_IN', account('B'))
  assert.deepEqual(values.objectives.objetivos, [])
  assert.deepEqual(values.objectives.objetivosPend, [])
  assert.deepEqual(values.objectives.objetivosFav, [])
  for (const field of ['tiempo', 'tiempoSesion', 'tiempoFavorito'])
    assert.deepEqual(values.objectives[field], {})
  assert.equal(values.summary.tiempoTotal, 0)
  assert.equal(values.summary.cantidadPausas, 0)
  assert.equal(values.summary.acumuladorTiempoPausa, 0)
  assert.equal(values.summary.banderaUnicaVez, true)
  assert.equal(values.events.selectedEvent, null)
  assert.deepEqual(values.badges.insigniasXUsuario, [])
  await act(async () => {
    // These closures stand for delayed favorites/profile requests in route components.
    old.objectives.setObjetivosFav(['respuesta tardía'])
    old.profile.setProfilePic('late-A.png')
    old.auth.setSession(account('A'))
    old.preferences.setDarkModePreference(true)
    for (const request of requests.filter(
      r => r.id === 'A' || r.idUsuario === 'A'
    )) {
      request.resolve(
        request.table === 'events'
          ? [{ fechaLimite: '2026-10-14', nombre: 'A', idEvento: 9 }]
          : {
              data: [
                { idUsuario: 'A', modoOscuro: true, motivacionFavorita: 2 },
              ],
            }
      )
    }
  })
  assert.equal(values.auth.session.user.id, 'B')
  assert.deepEqual(values.objectives.objetivosFav, [])
  assert.deepEqual(values.events.events, [])
  assert.deepEqual(values.badges.insigniasXUsuario, [])
  assert.equal(values.profile.profilePic, 'Positiva')
  assert.equal(values.preferences.darkModePreference, false)
  await act(async () => values.objectives.setObjetivos(['B']))
  await emit('SIGNED_OUT', null)
  assert.equal(values.auth.session, null)
  assert.deepEqual(values.objectives.objetivos, [])
  // Repeated SIGNED_OUT also clears guest-only data.
  await act(async () => values.objectives.setObjetivos(['guest']))
  await emit('SIGNED_OUT', null)
  assert.deepEqual(values.objectives.objetivos, [])
  await unmount()
})

test('functional boolean/string updates persist resolved values and recover per identity', async () => {
  storage.set('motivationPreference', '2') // Unattributable legacy data is ignored.
  await mount()
  assert.equal(values.preferences.motivationPreference, '1')
  await emit('SIGNED_IN', account('A'))
  await act(async () => {
    values.preferences.setDarkModePreference(previous => !previous)
    values.preferences.setNotificationPreference(previous => !previous)
    values.preferences.setMotivationPreference(previous =>
      previous === '1' ? '2' : '1'
    )
  })
  assert.equal(storage.get('capyfocus:user:A:darkModePreference'), 'true')
  assert.equal(storage.get('capyfocus:user:A:notificationPreference'), 'false')
  assert.equal(storage.get('capyfocus:user:A:motivationPreference'), '2')
  assert.equal(storage.get('theme'), 'dark')
  await act(async () => {
    values.preferences.setDarkModePreference(previous => !previous)
    values.preferences.setDarkModePreference(previous => !previous)
  })
  assert.equal(values.preferences.darkModePreference, true)
  assert.equal(storage.get('capyfocus:user:A:darkModePreference'), 'true')
  await emit('SIGNED_IN', account('B'))
  assert.equal(values.preferences.darkModePreference, false)
  assert.equal(values.preferences.motivationPreference, '1')
  await emit('SIGNED_IN', account('A'))
  assert.equal(values.preferences.darkModePreference, true)
  assert.equal(values.preferences.notificationPreference, false)
  assert.equal(values.preferences.motivationPreference, '2')
  await emit('SIGNED_OUT', null)
  assert.equal(values.preferences.darkModePreference, false)
  assert.equal(values.preferences.motivationPreference, '1')
  assert.ok(writes.every(([, value]) => !value.includes('=>')))
  await unmount()
})

test('remote defaults update effective motivation until an explicit session choice', async () => {
  await mount()
  await emit('SIGNED_IN', account('A'))
  assert.equal(values.motivation.motivationType, 'Positiva')
  await act(async () =>
    requests
      .find(r => r.table === 'Usuarios' && r.id === 'A')
      .resolve({
        data: [
          { motivacionFavorita: 2, modoOscuro: true, notificaciones: false },
        ],
      })
  )
  assert.equal(values.preferences.motivationPreference, '2')
  assert.equal(values.motivation.motivationType, 'Pasivo Agresiva')
  await act(async () => values.motivation.setMotivationType(() => 'Positiva'))
  await act(async () => values.preferences.setMotivationPreference('1'))
  await act(async () => values.preferences.setMotivationPreference('2'))
  await emit('TOKEN_REFRESHED', account('A'))
  assert.equal(values.motivation.motivationType, 'Positiva')
  await emit('SIGNED_OUT', null)
  await emit('SIGNED_IN', account('A'))
  assert.equal(values.motivation.motivationType, 'Pasivo Agresiva')
  await unmount()
})

test('late remote preferences cannot override a newer local choice or another identity storage', async () => {
  await mount()
  await emit('SIGNED_IN', account('A'))
  const request = requests.find(r => r.table === 'Usuarios' && r.id === 'A')
  await act(async () => values.preferences.setMotivationPreference('2'))
  await act(async () =>
    request.resolve({ data: [{ motivacionFavorita: 1, modoOscuro: true }] })
  )
  assert.equal(values.preferences.motivationPreference, '2')
  await emit('SIGNED_IN', account('B'))
  const late = requests.find(r => r.table === 'Usuarios' && r.id === 'B')
  await emit('SIGNED_OUT', null)
  await act(async () =>
    late.resolve({ data: [{ motivacionFavorita: 2, modoOscuro: true }] })
  )
  assert.equal(values.preferences.darkModePreference, false)
  assert.equal(storage.get('capyfocus:user:B:darkModePreference'), 'false')
  assert.equal(storage.get('capyfocus:guest:darkModePreference'), 'false')
  await unmount()
})

test('persistence and theme changes happen outside functional state updaters', async () => {
  await mount()
  await emit('SIGNED_IN', account('A'))
  const before = writes.length
  await act(async () => {
    values.preferences.setDarkModePreference(previous => {
      assert.equal(writes.length, before)
      assert.equal(storage.get('theme'), 'light')
      return !previous
    })
    values.preferences.setMotivationPreference(previous => {
      assert.equal(writes.length, before)
      return previous === '1' ? '2' : '1'
    })
  })
  assert.equal(storage.get('theme'), 'dark')
  assert.equal(storage.get('capyfocus:user:A:motivationPreference'), '2')
  await unmount()
})

test('logout waits for the SDK result, reports returned and thrown errors, and leaves token storage to SDK', async () => {
  extraView = c.Usuario
  await mount()
  await emit('SIGNED_IN', account('A'))
  const navigations = []
  globalThis.__contextNavigate = path => navigations.push(path)
  let response = deferred()
  globalThis.__contextSignOut = () => response.promise
  const logout = () =>
    root.root
      .findAllByType('button')
      .find(button => button.props.children === 'Cerrar sesión')
  await act(async () => logout().props.onClick())
  assert.equal(logout().props.disabled, true)
  assert.deepEqual(navigations, [])
  await act(async () => response.resolve({ error: new Error('SDK error') }))
  assert.equal(globalThis.__contextErrors.length, 1)
  assert.equal(logout().props.disabled, false)
  assert.deepEqual(navigations, [])
  globalThis.__contextSignOut = () =>
    Promise.reject(new Error('transport error'))
  await act(async () => logout().props.onClick())
  assert.equal(globalThis.__contextErrors.length, 2)
  assert.deepEqual(navigations, [])
  globalThis.__contextSignOut = async () => ({ error: null })
  await act(async () => logout().props.onClick())
  assert.deepEqual(navigations, ['/login'])
  assert.equal(values.auth.session.user.id, 'A') // Only auth events own the reset.
  await emit('SIGNED_OUT', null)
  assert.equal(values.auth.session, null)
  await unmount()
})

test('switch controls use associated labels, reflect preferences, and mark notifications unavailable', async () => {
  extraView = c.Switchers
  await mount()
  await emit('SIGNED_IN', account('A'))
  const dark = root.root.findByProps({ id: 'default-dark-mode' })
  assert.equal(dark.props.checked, false)
  assert.equal(typeof dark.props.onCheckedChange, 'function')
  assert.equal(
    root.root.findByProps({ htmlFor: 'default-dark-mode' }).props.children[0],
    'Modo oscuro predeterminado: '
  )
  const notifications = root.root.findByProps({ id: 'notifications' })
  assert.equal(notifications.props.disabled, true)
  assert.equal(
    notifications.props['aria-describedby'],
    'notifications-unavailable'
  )
  assert.ok(
    root.root
      .findByProps({ id: 'notifications-unavailable' })
      .props.children.includes('no envía notificaciones')
  )
  assert.equal(
    root.root.findByProps({ id: 'favorite-motivation' }).props.id,
    'favorite-motivation'
  )
  await unmount()
})

test('preference controls apply confirmed writes and expose failures for retry', async () => {
  extraView = c.Switchers
  await mount()
  await emit('SIGNED_IN', account('A'))
  const dark = () => root.root.findByProps({ id: 'default-dark-mode' })
  await act(async () => dark().props.onCheckedChange(true))
  assert.equal(dark().props.disabled, true)
  assert.equal(values.preferences.darkModePreference, false)
  let request = requests.find(r => r.update)
  assert.deepEqual(request.update, { modoOscuro: true })
  assert.equal(request.id, 'A')
  await act(async () => request.resolve({ error: new Error('offline') }))
  assert.equal(values.preferences.darkModePreference, false)
  assert.equal(dark().props.disabled, false)
  assert.ok(
    root.root
      .findByProps({ role: 'status' })
      .props.children.includes('No se pudo guardar')
  )
  await act(async () => dark().props.onCheckedChange(true))
  request = requests.filter(r => r.update).at(-1)
  await act(async () => request.resolve({ error: null }))
  assert.equal(values.preferences.darkModePreference, true)
  assert.equal(dark().props.checked, true)
  assert.equal(storage.get('capyfocus:user:A:darkModePreference'), 'true')
  await unmount()
})
