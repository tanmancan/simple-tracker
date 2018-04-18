import { createStore } from "redux";
import { timerApp } from "./reducers/timer";

const savedTimerState = JSON.parse(window.localStorage.getItem('timerApp'));
const store = createStore(
  timerApp,
  savedTimerState || {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  let savedState = JSON.stringify(store.getState());
  window.localStorage.setItem('timerApp', savedState);
});

export default store;
