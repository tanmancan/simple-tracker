import { connect } from "react-redux";
import { addTimer, updateTimer, deleteTimer, stopTimer } from "../store/actions";
import App from '../App';

const getStateById = (state) => (id) => {
  return state.timerById[id];
}

const getAllTimerStates = (state) => {
  return state.timerById;
}

const getAllTimers = (state) => {
  return state.timers;
}

const getActiveTimer = (state) => {
  return state.activeTimer;
}

const getTotalTime = (state) => {
  return Object.entries(state.timerById)
    .reduce((total, [id, timerState]) => {
      return total + timerState.timeProgress
    }, 0);
}

const mapStateToProps = state => {
  return {
    getStateById: getStateById(state),
    getAllTimerStates: getAllTimerStates(state),
    getAllTimers: getAllTimers(state),
    getActiveTimer: getActiveTimer(state),
    getTotalTime: getTotalTime(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTimerAdd: ({timerState, id}) => {
      dispatch(addTimer({timerState, id}));
    },
    onTimerUpdate: ({timerState, id}) => {
      dispatch(updateTimer({timerState, id}));
    },
    onTimerDelete: ({timerState, id}) => {
      dispatch(deleteTimer({timerState, id}));
    },
    onTimerStop: ({timerState, id}) => {
      dispatch(stopTimer({timerState, id}));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
