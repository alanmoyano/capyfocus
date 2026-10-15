// Motor puro del Capydoro (Pomodoro).
// Igual que el CapyMetro, el tiempo sale de timestamps y se acumula por tramos,
// así que el estudio efectivo no depende de las duraciones planificadas.
//
// Fases y transiciones:
// - 'setup': esperando que se elijan los minutos. 'start' arranca un ciclo nuevo.
// - 'study': cuenta regresiva de estudio. Al llegar a cero, o con 'skip', pasa a
//   'break' en pausa: el descanso empieza cuando el usuario lo reanuda.
// - 'break': cuenta regresiva de descanso. Al llegar a cero, o con 'skip', vuelve a
//   'setup' y el ciclo cuenta como completo.
// - 'finished': la sesión terminó; solo 'reset' cambia el estado.
// 'pause'/'stop' detienen la cuenta y 'resume'/'startBr' la retoman en la fase actual.
// Pausar no suma tiempo ni de estudio ni de descanso.

export type CapydoroPhase = 'setup' | 'study' | 'break' | 'finished'

export type CapydoroCommand =
  | { action: 'start'; studyTime: number; breakTime: number }
  | { action: 'pause' | 'stop' | 'resume' | 'startBr' | 'finalize' }
  // segmentId: tramo que el usuario veía al saltar; evita saltar dos fases con un doble clic
  | { action: 'skip'; segmentId?: number }
  | { action: 'reset' }

export type CapydoroState = {
  phase: CapydoroPhase
  running: boolean
  plannedStudyMs: number
  plannedBreakMs: number
  // Tiempo restante de la fase al abrir el tramo actual (o al pausar)
  remainingMs: number
  segmentStartedAt: number | null
  // Milisegundos efectivos de tramos ya cerrados
  studyMs: number
  breakMs: number
  completedStudies: number
  completedBreaks: number
  // Cambia cada vez que se abre o reinicia un tramo; sirve para resincronizar la UI
  segmentId: number
}

export type CapydoroSnapshot = {
  phase: CapydoroPhase
  running: boolean
  timeLeft: number // segundos restantes de la fase actual
  studySeconds: number // estudio efectivo acumulado
  breakSeconds: number // descanso efectivo acumulado
  completedStudies: number
  completedBreaks: number
  segmentId: number
  // Campos del protocolo original
  isWorking: boolean
  isPaused: boolean
}

export function createCapydoroState(): CapydoroState {
  return {
    phase: 'setup',
    running: false,
    plannedStudyMs: 0,
    plannedBreakMs: 0,
    remainingMs: 0,
    segmentStartedAt: null,
    studyMs: 0,
    breakMs: 0,
    completedStudies: 0,
    completedBreaks: 0,
    segmentId: 0,
  }
}

// Cierra el tramo abierto en `now`, sin pasar del final planificado de la fase.
function closeSegment(state: CapydoroState, now: number): CapydoroState {
  if (!state.running || state.segmentStartedAt === null) return state
  const elapsed = Math.min(
    Math.max(0, now - state.segmentStartedAt),
    state.remainingMs
  )
  return {
    ...state,
    running: false,
    segmentStartedAt: null,
    remainingMs: state.remainingMs - elapsed,
    studyMs: state.phase === 'study' ? state.studyMs + elapsed : state.studyMs,
    breakMs: state.phase === 'break' ? state.breakMs + elapsed : state.breakMs,
  }
}

function endPhase(state: CapydoroState): CapydoroState {
  if (state.phase === 'study') {
    return {
      ...state,
      phase: 'break',
      running: false,
      remainingMs: state.plannedBreakMs,
      completedStudies: state.completedStudies + 1,
      segmentId: state.segmentId + 1,
    }
  }
  if (state.phase === 'break') {
    return {
      ...state,
      phase: 'setup',
      running: false,
      remainingMs: 0,
      completedBreaks: state.completedBreaks + 1,
      segmentId: state.segmentId + 1,
    }
  }
  return state
}

export function applyCapydoroCommand(
  state: CapydoroState,
  command: CapydoroCommand,
  now: number
): CapydoroState {
  if (command.action === 'reset') return createCapydoroState()
  if (state.phase === 'finished') return state

  // Antes de cualquier comando, aplicar un fin de fase que ya haya ocurrido
  const current = tickCapydoro(state, now)

  switch (command.action) {
    case 'start': {
      if (current.phase !== 'setup') return current
      const plannedStudyMs = Math.max(0, command.studyTime) * 1000
      const plannedBreakMs = Math.max(0, command.breakTime) * 1000
      return {
        ...current,
        phase: 'study',
        running: true,
        plannedStudyMs,
        plannedBreakMs,
        remainingMs: plannedStudyMs,
        segmentStartedAt: now,
        segmentId: current.segmentId + 1,
      }
    }
    case 'pause':
    case 'stop':
      return closeSegment(current, now)
    case 'resume':
    case 'startBr': {
      if (current.running) return current
      if (current.phase !== 'study' && current.phase !== 'break') return current
      return {
        ...current,
        running: true,
        segmentStartedAt: now,
        segmentId: current.segmentId + 1,
      }
    }
    case 'skip': {
      // Si la fase terminó sola justo antes del salto, no saltar también la siguiente
      if (current.segmentId !== state.segmentId) return current
      if (
        command.segmentId !== undefined &&
        command.segmentId !== current.segmentId
      ) {
        return current
      }
      if (current.phase !== 'study' && current.phase !== 'break') return current
      return endPhase(closeSegment(current, now))
    }
    case 'finalize':
      return {
        ...closeSegment(current, now),
        phase: 'finished',
        running: false,
      }
    default:
      return current
  }
}

// Detecta el fin natural de la fase. El tramo se cierra en el instante exacto en
// que terminó, aunque el tick llegue tarde (pestaña en segundo plano, suspensión).
export function tickCapydoro(state: CapydoroState, now: number): CapydoroState {
  if (!state.running || state.segmentStartedAt === null) return state
  const endsAt = state.segmentStartedAt + state.remainingMs
  if (now < endsAt) return state
  return endPhase(closeSegment(state, endsAt))
}

export function isCapydoroRunning(state: CapydoroState) {
  return state.running
}

export function capydoroSnapshot(
  state: CapydoroState,
  now: number
): CapydoroSnapshot {
  const current = closeSegment(state, now)
  return {
    phase: state.phase,
    running: state.running,
    timeLeft: Math.ceil(current.remainingMs / 1000),
    studySeconds: Math.floor(current.studyMs / 1000),
    breakSeconds: Math.floor(current.breakMs / 1000),
    completedStudies: state.completedStudies,
    completedBreaks: state.completedBreaks,
    segmentId: state.segmentId,
    isWorking: state.phase === 'study',
    isPaused: !state.running,
  }
}
