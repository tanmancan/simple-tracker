import { connect } from "react-redux";
import { addTimer, updateTimer, deleteTimer, stopTimer, updateTimerOrder, timerDrag, undoTimerDelete, restoreGlobalState } from "../store/actions/timer";
import { initTimerState } from '../store/reducers/timer';
import App from '../App';

window.undoState = {};

const getGlobalState = (state) => {
  return state;
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

const getTotalTimeByDate = (state) => (date) => {
  return Object.entries(state.timerById)
    .filter(([id, timerState]) =>
      new Date(timerState.timerStartDate).toDateString()
        === new Date(date).toDateString())
    .reduce((total, [id, timerState]) => {
      return total + timerState.timeProgress
    }, 0);
}

const getAllTagsById = (state) => {
  return state.tagsById;
}

const getFilteredCategories = (state) => {
  return state.filterCategories;
}

const mapTimerStateToProps = globalState => {
  let timerState = globalState.timerState;
  let tagState = globalState.tagState;

  return {
    getGlobalState: getGlobalState(globalState),
    getDragState: getDragState(timerState),
    getStateById: getStateById(timerState),
    getAllTimerStates: getAllTimerStates(timerState),
    getAllTimers: getAllTimers(timerState),
    getActiveTimer: getActiveTimer(timerState),
    getTotalTime: getTotalTime(timerState),
    getTotalTimeByDate: getTotalTimeByDate(timerState),
    getAllTagsById: getAllTagsById(tagState),
    getFilteredCategories: getFilteredCategories(tagState),
  }
}

const mapTimerDispatchToProps = dispatch => {
  return {
    onRestoreGlobalState: (state) => {
      dispatch(restoreGlobalState(state));
    },
    onTimerAdd: (stateOpts = {}) => {
      let uid = +`${Math.floor(Math.random() * 1000)}${+new Date()}`;
      let id = `timer-${uid}`;
      let timerState = {
        ...initTimerState,
        timerStartDate: +new Date(),
        title: id,
        description: `Description for timer ${id}`,
        openEditModal: false,
        ...stateOpts
      }
      dispatch(addTimer({timerState, id}));

      let dateOpts = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: '2-digit'
      }

      window.showToast(`Timer Added for ${new Date(timerState.timerStartDate).toLocaleDateString('en-US', dateOpts)}`);
    },
    onTimerUpdate: ({timerState, id}) => {
      dispatch(updateTimer({timerState, id}));
    },
    onTimerDelete: ({timerState, id}) => {
      dispatch(deleteTimer({ timerState, id }));
      timerState.timerRunning = false;
      window.undoState[id] = {
        timerState,
        id
      };

      // Only reason for this nonsense is because we are passing the closure via a string to the toast option
      // @TODO: implement a better way to pass undoDelete handler to toast options
      window.undoDelete = (target, id) => {
        if (window.undoState && window.undoState[id]) {
          dispatch(undoTimerDelete(window.undoState[id]));
          target.parentNode.innerHTML = 'Timer Restored';
        }
        delete window.undoState[id];
      }

      let deleteMessage = `
        Timer Deleted &nbsp; <a href="#undo" onclick="window.undoDelete(this, '${id}');" class="orange-text">Undo</a>
      `;

      window.showToast(deleteMessage, {displayLength: 6000});
    },
    onTimerStop: ({timerState, id}) => {
      dispatch(stopTimer({ timerState, id }));
      window.showToast('Timer Stopped');
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
  mapTimerStateToProps,
  mapTimerDispatchToProps
)(App);
