import * as timerAction from '../actions/timer';

export const initTimerState = {
  title: '',
  description: '',
  timerRunning: false,
  timeProgress: 0,
  timeStart: null,
  timerStartDate: null,
  tags: {}
};

function timerDrag(state = false, action) {
  switch (action.type) {
    case timerAction.TIMER_DRAG: {
      return action.dragState;
    }
    default: {
      return state;
    }
  }
}

function timerById(state = {}, action) {
  switch (action.type) {
    case timerAction.ADD_TIMER: {
      return {
        ...state,
        [action.id]: Object.keys(action.timerState).length > 0
          ? action.timerState
          : initTimerState
      }
    }
    case timerAction.UPDATE_TIMER: {
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
          : initTimerState;

        return [id, timerState];
      });
      return state;
    }
    case timerAction.STOP_TIMER: {
      Object.values(state).map(timer => {
        if (timer.id === action.id && action.timerState) {
          timer = action.timerState
        }
        timer.timerRunning = false;
        return timer;
      });

      return state;
    }
    case timerAction.DELETE_TIMER: {
      delete state[action.id];
      return state;
    }
    case timerAction.UNDO_TIMER_DELETE: {
      return {
        ...state,
        [action.id]: Object.keys(action.timerState).length > 0
          ? action.timerState
          : initTimerState
      }
    }
    default: {
      return state;
    }
  }
}

function timers(state = [], action) {
  switch (action.type) {
    case timerAction.ADD_TIMER: {
      return [
        ...state,
        action.id
      ];
    }
    case timerAction.UPDATE_TIMER: {
      return state;
    }
    case timerAction.DELETE_TIMER: {
      if (state.indexOf(action.id) !== -1) {
        state.splice(state.indexOf(action.id), 1)
      }
      return state;
    }
    case timerAction.UNDO_TIMER_DELETE: {
      return [
        ...state,
        action.id
      ];
    }
    case timerAction.UPDATE_TIMER_ORDER: {
      let targetPos = Number(action.targetPos);
      let currentPos = state.indexOf(action.id);

      if (targetPos !== currentPos && targetPos !== currentPos + 1) {
        if (targetPos > currentPos && targetPos !== state.length) {
          targetPos -= 1;
        }

        let targetTimer = state.splice(currentPos, 1).shift();

        state.splice(targetPos, 0, targetTimer);
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
    case timerAction.ADD_TIMER: {
      return action.timerState.timerRunning === true
        ? [action.id]
        : state;
    }
    case timerAction.UPDATE_TIMER: {
      return action.timerState.timerRunning === true
        ? [action.id]
        : state;
    }
    case timerAction.STOP_TIMER: {
      return [];
    }
    case timerAction.DELETE_TIMER: {
      return action.timerState.timerRunning === true
        ? []
        : state;
    }
    default:
      return state;
  }
}

function deletedTimersById(state = {}, action) {
  switch (action.type) {
    case timerAction.DELETE_TIMER: {
      return {
        ...state,
        [action.id]: action.timerState
      }
    }
    case timerAction.UNDO_TIMER_DELETE: {
      delete state[action.id];
      return state;
    }
    default: {
      return state;
    }
  }
}

function deletedTimers(state = [], action) {
  switch (action.type) {
    case timerAction.DELETE_TIMER: {
      return [
        ...state,
        action.id
      ]
    }
    case timerAction.UNDO_TIMER_DELETE: {
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

export const timerState = (state = {}, action) => {
  return {
    timerDrag: timerDrag(state.timerDrag, action),
    timerById: timerById(state.timerById, action),
    timers: timers(state.timers, action),
    activeTimer: activeTimer(state.activeTimer, action),
    deletedTimersById: deletedTimersById(state.deletedTimersById, action),
    deletedTimers: deletedTimers(state.deletedTimers, action),
  };
}
