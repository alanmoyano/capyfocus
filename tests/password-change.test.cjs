const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

// Ejecuta el componente real con hooks y servicios simulados, sin red ni DOM.
function mount(updateUser, isSubmitting = false) {
  const calls = { success: [], error: [], locations: [] }
  let submit
  const component = () => null
  const mocks = {
    '@/components/supabase/client': { supabase: { auth: { updateUser } } },
    '@/components/ui/form': Object.fromEntries(
      [
        'Form',
        'FormControl',
        'FormField',
        'FormItem',
        'FormLabel',
        'FormMessage',
      ].map(name => [name, component])
    ),
    '@/components/ui/input': { Input: component },
    '@components/ui/button': { Button: component },
    '@hookform/resolvers/zod': { zodResolver: () => undefined },
    react: { useRef: value => ({ current: value }) },
    'react-hook-form': {
      useForm: () => ({
        formState: { isSubmitting },
        handleSubmit: handler => {
          submit = handler
          return handler
        },
      }),
    },
    sonner: {
      toast: {
        success: message => calls.success.push(message),
        error: message => calls.error.push(message),
      },
    },
    wouter: { useLocation: () => ['/', path => calls.locations.push(path)] },
  }
  const source = readFileSync(
    join(__dirname, '../src/components/PasswordChange.tsx'),
    'utf8'
  )
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  })
  const exports = {}
  vm.runInNewContext(outputText, {
    exports,
    require: name => mocks[name] ?? require(name),
    console: { log: () => assert.fail('No se deben imprimir credenciales') },
  })
  const tree = exports.default()
  const button = tree.props.children.props.children.at(-1)
  return { submit, calls, button }
}

const values = { password: 'Test-password-123!' }

test('espera la respuesta antes de anunciar éxito y bloquea envíos simultáneos', async () => {
  let resolve
  let requests = 0
  const response = new Promise(done => {
    resolve = done
  })
  const { submit, calls } = mount(payload => {
    requests++
    assert.deepEqual(payload.password, values.password)
    return response
  })
  const first = submit(values)
  await submit(values)
  assert.equal(requests, 1)
  assert.equal(calls.success.length, 0)
  assert.equal(calls.locations.length, 0)
  resolve({ error: null })
  await first
  assert.equal(calls.success.length, 1)
  assert.deepEqual(calls.locations, ['/usuario'])
  assert.equal(calls.error.length, 0)
})

for (const failure of ['returned error', 'rejection']) {
  test(`${failure}: muestra error, no navega y permite reintentar`, async () => {
    let requests = 0
    const { submit, calls } = mount(async () => {
      if (++requests > 1) return { error: null }
      if (failure === 'rejection') throw new Error('network error')
      return { error: { message: 'auth error' } }
    })
    await submit(values)
    assert.equal(calls.error.length, 1)
    assert.equal(calls.success.length, 0)
    assert.equal(calls.locations.length, 0)
    await submit(values)
    assert.equal(requests, 2)
    assert.equal(calls.success.length, 1)
    assert.deepEqual(calls.locations, ['/usuario'])
  })
}

test('el botón refleja el estado pending del formulario', () => {
  const { button } = mount(async () => ({ error: null }), true)
  assert.equal(button.props.disabled, true)
  assert.equal(button.props['aria-busy'], true)
  assert.equal(button.props.children, 'Cambiando...')
})

test('signup conserva el payload y no imprime formulario, respuesta ni errores de auth', async () => {
  for (const error of [null, { message: 'User already registered' }]) {
    let submit
    let operation
    let payload
    const mocks = {
      react: { useState: value => [value, () => {}] },
      'react-hook-form': {
        useForm: () => ({
          handleSubmit: handler => {
            submit = handler
            return handler
          },
        }),
      },
      '@hookform/resolvers/zod': { zodResolver: () => undefined },
      './supabase/client': {
        supabase: {
          auth: {
            signUp: async values => {
              payload = values
              return {
                data: { session: { access_token: 'sensitive-token' } },
                error,
              }
            },
          },
        },
      },
      'posthog-js': { default: { capture: () => {} } },
      sonner: {
        toast: {
          promise: (action, options) => {
            operation = action().catch(failure => options.error(failure))
          },
        },
      },
    }
    const source = readFileSync(
      join(__dirname, '../src/components/SignUpForm.tsx'),
      'utf8'
    )
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    })
    const exports = {}
    vm.runInNewContext(outputText, {
      exports,
      require: name => {
        if (mocks[name]) return mocks[name]
        if (name.startsWith('@/'))
          return new Proxy({}, { get: () => () => null })
        return require(name)
      },
      console: {
        log: () => assert.fail('Signup no debe imprimir datos sensibles'),
        error: () => assert.fail('Signup no debe imprimir respuestas de auth'),
      },
    })
    exports.default()
    const birthdate = new Date('2000-01-02T00:00:00Z')
    submit({ ...values, name: 'Capy', email: 'capy@example.com', birthdate })
    await operation
    assert.equal(
      JSON.stringify(payload),
      JSON.stringify({
        email: 'capy@example.com',
        password: values.password,
        options: { data: { name: 'Capy', birthdate: '2000-01-02' } },
      })
    )
  }
})
