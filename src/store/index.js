import { createStore, combineReducers } from "redux";
import { timerState } from "./reducers/timer";
import { tagState } from "./reducers/tags";

const savedTimerState = (window.localStorage)
  ? JSON.parse(window.localStorage.getItem('timerState') || '{}')
  : {};
const savedTagState = (window.localStorage)
  ? JSON.parse(window.localStorage.getItem('tagState') || '{}')
  : {};
const rootReducer = combineReducers({timerState, tagState});
const savedState = {
  timerState: savedTimerState,
  tagState: savedTagState
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
  }
});

export default store;
