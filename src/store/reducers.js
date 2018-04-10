import {ADD_TIMER, UPDATE_TIMER, DELETE_TIMER} from './actions';

export const initState = {
  timerRunning: false,
  timeProgress: 0,
  timeStart: null,
  rafId: null,
};

function timerById(state = {}, action) {
  switch (action.type) {
    case ADD_TIMER: {
      return {
        ...state,
        [action.id]: Object.keys(action.timerState).length > 0
          ? action.timerState
          : initState
      }
    }
    case UPDATE_TIMER: {
      return {
        ...state,
        [action.id]: Object.keys(action.timerState).length > 0
          ? action.timerState
          : initState
      }
    }
    default: {
      return state;
    }
  }
}

function timers(state = [], action) {
  switch (action.type) {
    case ADD_TIMER: {
      return [
        ...state,
        action.id
      ];
    }
    case UPDATE_TIMER: {
      return state;
    }
    default: {
      return state;
    }
  }
}

function activeTimer(state = [], action) {
  switch (action.type) {
    case ADD_TIMER: {
      return action.timerState.timerRunning === true
        ? [action.id]
        : state;
    }
    case UPDATE_TIMER: {
      return action.timerState.timerRunning === true
        ? [action.id]
        : [];
    }
    case DELETE_TIMER: {
      return action.timerState.timerRunning === true
        ? []
        : state;
    }
    default:
      return state;
  }
}

export const timerApp = (state = {}, action) => {
  return {
    timerById: timerById(state.timerById, action),
    timers: timers(state.timers, action),
    activeTimer: activeTimer(state.activeTimer, action),
  };
}