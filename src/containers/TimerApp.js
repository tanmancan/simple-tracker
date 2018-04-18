import { connect } from "react-redux";
import { addTimer, updateTimer, deleteTimer, stopTimer, updateTimerOrder, timerDrag } from "../store/actions/timer";
import { initTimerState } from '../store/reducers/timer';
import App from '../App';

const showToast = (msg = '', opts = {}) => {
  window.M.toast({
    html: `${msg}`,
    displayLength: 2000,
    ...opts
  });
}

const getDragState = (state) => {
  return state.timerDrag;
}

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
    getDragState: getDragState(state),
    getStateById: getStateById(state),
    getAllTimerStates: getAllTimerStates(state),
    getAllTimers: getAllTimers(state),
    getActiveTimer: getActiveTimer(state),
    getTotalTime: getTotalTime(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTimerAdd: () => {
      let uid = +`${Math.floor(Math.random() * 1000)}${+new Date()}`;
      let id = `timer-${uid}`;
      let timerState = {
        ...initTimerState,
        timerStartDate: +new Date(),
      }
      dispatch(addTimer({timerState, id}));
      showToast('Timer Added');
      return true;
    },
    onTimerUpdate: ({timerState, id}) => {
      dispatch(updateTimer({timerState, id}));
    },
    onTimerDelete: ({timerState, id}) => {
      dispatch(deleteTimer({ timerState, id }));
      showToast('Timer Deleted');
    },
    onTimerStop: ({timerState, id}) => {
      dispatch(stopTimer({ timerState, id }));
      showToast('Timer Stopped');
    },
    onTimerUpdateOrder: ({targetPos, id}) => {
      dispatch(updateTimerOrder({targetPos, id}));
    },
    onTimerDrag: ({dragState, id}) => {
      dispatch(timerDrag({dragState, id}));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
