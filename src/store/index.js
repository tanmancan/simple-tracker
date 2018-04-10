import { createStore } from "redux";
import { timerApp } from "./reducers";

const store = createStore(timerApp);

export default store;