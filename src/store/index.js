import { createStore, combineReducers } from "redux";
import { timerState } from "./reducers/timer";
import { tagState } from "./reducers/tags";
import { appState } from "./reducers/app";
import { RESTORE_GLOBAL_STATE } from './actions/timer';

const savedTimerState = (window.localStorage)
  ? JSON.parse(window.localStorage.getItem('timerState') || '{}')
  : {};
const savedTagState = (window.localStorage)
  ? JSON.parse(window.localStorage.getItem('tagState') || '{}')
  : {};
const savedAppState = (window.localStorage)
  ? JSON.parse(window.localStorage.getItem('appState') || '{}')
  : {};

const appReducer = combineReducers({
  timerState,
  tagState,
  appState,
});

const rootReducer = (state, action) => {
  switch (action.type) {
    case RESTORE_GLOBAL_STATE: {
      state = action.state;
      break;
    }
    default: {
      break;
    }
  }

  return appReducer(state, action);
}

const savedState = {
  timerState: savedTimerState,
  tagState: savedTagState,
  appState: savedAppState,
};

const store = createStore(
  rootReducer,
  savedState || {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  if (window.localStorage) {
    let state = store.getState();
    let savedTimerState = JSON.stringify(state.timerState);
    window.localStorage.setItem('timerState', savedTimerState);
    let savedTagState = JSON.stringify(state.tagState);
    window.localStorage.setItem('tagState', savedTagState);
    let savedAppState = JSON.stringify(state.appState);
    window.localStorage.setItem('tagState', savedAppState);
  }
});

export default store;
