// Motor puro del CapyMetro (cronómetro libre de estudio y descanso).
// El tiempo se calcula a partir de timestamps, no contando callbacks del interval,
// así que un tick tardío o un interval duplicado no cambian el resultado.
//
// Comandos (mismo protocolo que usaba el worker):
// - 'startTimer1': empieza a contar estudio. Si ya se está estudiando, no hace nada.
// - 'pauseTimer1': empieza a contar descanso. Si ya se está descansando, no hace nada.
// - 'finalize': deja de contar y conserva los acumulados. Un 'startTimer1' o
//   'pauseTimer1' posterior retoma la cuenta, como hacía el worker original.
// - 'reset': vuelve todo a cero.

export type CapymetroPhase = 'idle' | 'study' | 'break' | 'stopped'
export type CapymetroCommand =
  | 'startTimer1'
  | 'pauseTimer1'
  | 'finalize'
  | 'reset'

export type CapymetroState = {
  phase: CapymetroPhase
  // Milisegundos de tramos ya cerrados
  studyMs: number
  breakMs: number
  // Inicio del tramo abierto (solo en 'study' o 'break')
  segmentStartedAt: number | null
}

export type CapymetroSnapshot = {
  timer1: number // segundos de estudio efectivo
  timer2: number // segundos de descanso
  phase: CapymetroPhase
}

export function createCapymetroState(): CapymetroState {
  return { phase: 'idle', studyMs: 0, breakMs: 0, segmentStartedAt: null }
}

function closeSegment(state: CapymetroState, now: number): CapymetroState {
  if (state.segmentStartedAt === null) return state
  const elapsed = Math.max(0, now - state.segmentStartedAt)
  return {
    ...state,
    studyMs: state.phase === 'study' ? state.studyMs + elapsed : state.studyMs,
    breakMs: state.phase === 'break' ? state.breakMs + elapsed : state.breakMs,
    segmentStartedAt: null,
  }
}

export function applyCapymetroCommand(
  state: CapymetroState,
  command: CapymetroCommand,
  now: number
): CapymetroState {
  switch (command) {
    case 'startTimer1':
      if (state.phase === 'study') return state
      return {
        ...closeSegment(state, now),
        phase: 'study',
        segmentStartedAt: now,
      }
    case 'pauseTimer1':
      if (state.phase === 'break') return state
      return {
        ...closeSegment(state, now),
        phase: 'break',
        segmentStartedAt: now,
      }
    case 'finalize':
      return { ...closeSegment(state, now), phase: 'stopped' }
    case 'reset':
      return createCapymetroState()
    default:
      return state
  }
}

export function isCapymetroRunning(state: CapymetroState) {
  return state.phase === 'study' || state.phase === 'break'
}

export function capymetroSnapshot(
  state: CapymetroState,
  now: number
): CapymetroSnapshot {
  const current = closeSegment(state, now)
  return {
    timer1: Math.floor(current.studyMs / 1000),
    timer2: Math.floor(current.breakMs / 1000),
    phase: state.phase,
  }
}
