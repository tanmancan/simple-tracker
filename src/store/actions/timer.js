export const ADD_TIMER = 'ADD_TIMER';
export const DELETE_TIMER = 'DELETE_TIMER';
export const UPDATE_TIMER = 'UPDATE_TIMER';
export const STOP_TIMER = 'STOP_TIMER';
export const UPDATE_TIMER_ORDER = 'UPDATE_TIMER_ORDER';
export const TIMER_DRAG = 'TIMER_DRAG';
export const UNDO_TIMER_DELETE = 'UNDO_TIMER_DELETE';
export const RESTORE_GLOBAL_STATE = 'RESTORE_GLOBAL_STATE';

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

export function timerDrag({dragState, id}) {
  return {type: TIMER_DRAG, dragState, id}
}

export function undoTimerDelete({timerState, id}) {
  return {type: UNDO_TIMER_DELETE, timerState, id}
}

export function restoreGlobalState(state) {
  return {type: RESTORE_GLOBAL_STATE, state}
}
