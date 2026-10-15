const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} = require('node:fs')
const { tmpdir } = require('node:os')
const { join } = require('node:path')
const { spawnSync } = require('node:child_process')

const { scripts } = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
)

function runScript(name, tools, verify) {
  const cwd = mkdtempSync(join(tmpdir(), 'capyfocus-validation-'))
  try {
    mkdirSync(join(cwd, 'node_modules/.bin'), { recursive: true })
    writeFileSync(join(cwd, 'package.json'), JSON.stringify({ scripts }))
    for (const [name, source] of Object.entries(tools)) {
      writeFileSync(
        join(cwd, 'node_modules/.bin', name),
        '#!/bin/sh\n' + source,
        { mode: 0o755 }
      )
    }
    const result = spawnSync('npm', ['run', name], { cwd, encoding: 'utf8' })
    verify(result, cwd)
  } finally {
    rmSync(cwd, { recursive: true, force: true })
  }
}

test('check propaga un fallo de TypeScript', () => {
  runScript('check', { tsc: 'exit 2\n' }, result => {
    assert.equal(result.status, 2, result.stdout + result.stderr)
  })
})

test('check acepta una compilación exitosa', () => {
  runScript('check', { tsc: 'exit 0\n' }, result =>
    assert.equal(result.status, 0)
  )
})

test('prePush comprueba formato sin escribir y luego ejecuta TypeScript', () => {
  runScript(
    'prePush',
    {
      prettier: 'printf "%s\\n" "$*" > prettier-args\n',
      tsc: 'touch checked-types\n',
    },
    (result, cwd) => {
      assert.equal(result.status, 0, result.stdout + result.stderr)
      assert.equal(
        readFileSync(join(cwd, 'prettier-args'), 'utf8').trim(),
        '--check ./src'
      )
      assert.equal(readFileSync(join(cwd, 'checked-types'), 'utf8'), '')
    }
  )
})

test('prePush propaga fallos de formato y de TypeScript', () => {
  for (const tools of [
    { prettier: 'exit 1\n', tsc: 'exit 0\n' },
    { prettier: 'exit 0\n', tsc: 'exit 2\n' },
  ]) {
    runScript('prePush', tools, result => assert.notEqual(result.status, 0))
  }
})
