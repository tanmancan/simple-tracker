import { connect } from "react-redux";
import { addTimer, updateTimer, deleteTimer } from "../store/actions";
import TimerCardListBuilder from '../components/TimeCardListBuilder';

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

const mapStateToProps = state => {
  return {
    getStateById: getStateById(state),
    getAllTimerStates: getAllTimerStates(state),
    getAllTimers: getAllTimers(state),
    getActiveTimer: getActiveTimer(state),
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimerCardListBuilder);