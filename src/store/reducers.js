import {ADD_TIMER, UPDATE_TIMER, DELETE_TIMER, STOP_TIMER} from './actions';

export const initState = {
  title: '',
  description: '',
  timerRunning: false,
  timeProgress: 0,
  timeStart: null,
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
      Object.entries(state).map(([id, timerState]) => {
        let updatedState = (id === action.id)
          ? action.timerState
          : timerState;

        if (action.timerState.timerRunning === true) {
          updatedState.timerRunning = (id === action.id)
            ? action.timerState.timerRunning
            : false;
        }

        state[id] = Object.keys(action.timerState).length > 0
          ? updatedState
          : initState;

        return [id, timerState];
      });
      return state;
    }
    case STOP_TIMER: {
      Object.values(state).map(timer => {
        if (timer.id === action.id && action.timerState) {
          timer = action.timerState
        }
        timer.timerRunning = false;
        return timer;
      });

      return state;
    }
    case DELETE_TIMER: {
      delete state[action.id];
      return state;
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
    case DELETE_TIMER: {
      if (state.indexOf(action.id) !== -1) {
        state.splice(state.indexOf(action.id), 1)
      }
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
        : state;
    }
    case STOP_TIMER: {
      return [];
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
