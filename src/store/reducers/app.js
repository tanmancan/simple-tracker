import * as appAction from '../actions/app';

const ICON_RUN = '/favicon-run.ico';
const ICON_STOPPED = '/favicon.ico';

export const initAppGlobalState = {
  appTimerRunning: false,
  appFavIcon: ICON_STOPPED,
}

function timerRunningState(state = initAppGlobalState, action) {
  switch (action.type) {
    case appAction.TIMER_RUNNING: {
      return {
        ...state,
        appTimerRunning: true,
        appFavIcon: ICON_RUN,
      }
    }
    case appAction.TIMER_STOPPED: {
      return {
        ...state,
        appTimerRunning: false,
        appFavIcon: ICON_STOPPED,
      }
    }
    default: {
      return state;
    }
  }
}

export const appState = (state = {}, action) => {
  return {
    timerRunningState: timerRunningState(state.timerRunningState, action),
  }
}
