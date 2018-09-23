export const TIMER_RUNNING = 'TIMER_RUNNING';
export const TIMER_STOPPED = 'TIMER_STOPPED';

export function timerRunning({appState}) {
  return {type: TIMER_RUNNING, appState}
}

export function timerStopped({appState}) {
  return {type: TIMER_STOPPED, appState}
}
