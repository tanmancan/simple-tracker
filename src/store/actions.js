export const ADD_TIMER = 'ADD_TIMER';
export const DELETE_TIMER = 'DELETE_TIMER';
export const UPDATE_TIMER = 'UPDATE_TIMER';
export const STOP_TIMER = 'STOP_TIMER';
export const UPDATE_TIMER_ORDER = 'UPDATE_TIMER_ORDER';

export function addTimer({timerState, id}) {
  return {type: ADD_TIMER, timerState, id}
}

export function deleteTimer({timerState, id}) {
  return {type: DELETE_TIMER, timerState, id}
}

export function updateTimer({timerState, id}) {
  return {type: UPDATE_TIMER, timerState, id}
}

export function stopTimer({timerState, id}) {
  return {type: STOP_TIMER, timerState, id}
}

export function updateTimerOrder({targetPos, id}) {
  return {type: UPDATE_TIMER_ORDER, targetPos, id}
}
