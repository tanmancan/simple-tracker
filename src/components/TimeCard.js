import React, { Component } from 'react';
import {initTimerState} from '../store/reducers';
import TimeCardEdit from './TimeCardEdit';
import {Timer} from './Timer';

export default class TimeCard extends Component {
  constructor(props) {
    super(props);
    this.raf = window.requestAnimationFrame;
    this.rafId = null;
    this.modalRef = React.createRef();
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.removeTimer = this.removeTimer.bind(this);
    this.handleEditFormUpdate = this.handleEditFormUpdate.bind(this);
    this.openFormModal = this.openFormModal.bind(this);
    this.initState = initTimerState;
    this.id = this.props.id;
    this.state = {
      ...this.props.getStateById(this.id),
      title: this.props.getStateById(this.id).title || this.props.title || this.props.id,
      description: this.props.getStateById(this.id).description || this.props.description || ''
    };
  }

  componentDidMount() {
    window.M.AutoInit();
    this.setState((state, props) => {
      let timerActive = (this.state.timerRunning && this.props.getActiveTimer.indexOf(this.id) === 0);
      this.rafId = timerActive
        ? this.raf.call(window, () => this.timerRun())
        : null;
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
  }

  timerRun() {
    let timerState = {};

    this.setState((state, props) => {
      let timeStart = +new Date();
      let timeProgress = (timeStart - state.timeStart) + state.timeProgress;
      let timerActive = (state.timerRunning && this.props.getActiveTimer.indexOf(this.id) === 0);

      timerState = {
        ...state,
        timeStart,
        timeProgress,
        timerRunning: timerActive
      };

      if (timerActive) {
        this.rafId = this.raf.call(window, () => this.timerRun());
      } else {
        cancelAnimationFrame(this.rafId);
        this.props.onTimerUpdate({
          timerState,
          timerRunning: false,
          id: this.id
        });
      }

      return timerState;
    });
  }

  startTimer() {
    this.setState((state, props) => {
      let timerState = {
        ...this.props.getStateById(this.id),
        timerRunning: true,
        timeStart: +new Date(),
      }

      this.props.onTimerUpdate({
        timerState,
        id: this.id
      })

      this.rafId = this.raf.call(window, () => this.timerRun());

      return timerState;
    });
  }

  pauseTimer() {
    this.setState((state, props) => {
      let timerState = {
        ...state,
        timerRunning: false
      };

      props.onTimerStop({
        timerState,
        id: this.id
      });

      return timerState;
    });

  }

  resetTimer() {
    if (window.confirm('Are you sure you want to RESET this timer?')) {
      let state = this.props.getStateById(this.id);
      cancelAnimationFrame(state.rafId);
      this.props.onTimerUpdate({
        timerState: this.initState,
        id: this.id
      });
      this.setState((state, props) => this.initState);
    }
  }

  removeTimer() {
    if (window.confirm('Are you sure you want to REMOVE this timer?')) {
      this.props.onTimerDelete({
        id: this.id,
        timerState: {},
      });
    }
  }

  formatTimerDate() {
    let dateOpt = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    let date = new Date(this.state.timerStartDate);

    return date.toLocaleTimeString('en-US', dateOpt);
  }

  formatTime(milliseconds) {
    let time = milliseconds / 1000;
    const converter
      = (denom = 1) => ((time / denom) % 60 < 10 || (time / denom) % 60 === 60)
        ? `0${Math.floor(time / denom) % 60}`
        : `${Math.floor(time / denom) % 60}`;

    let sec = converter(1);
    let min = converter(60);
    let hr = converter(3600);

    return `${hr}:${min}:${sec}`;
  }

  editForm() {
    return React.createElement(
      TimeCardEdit, {
      ...this.props,
      title: this.state.title,
      description: this.state.description,
      handleEditFormUpdate: this.handleEditFormUpdate,
    });
  }

  handleEditFormUpdate(formState) {
    this.setState((state, props) => {
      let timerState = {
        ...this.state,
        ...formState
      }

      this.props.onTimerUpdate({
        timerState,
        id: this.id
      });

      return timerState;
    });
  }

  openFormModal() {
    window.M.Modal.init(this.modalRef.current, {});
  }

  cardClass(additionalClasses = [''], runningClasses = null, stoppedClasses = null) {
    const RUNNING = runningClasses || ['light-blue', 'lighten-1'];
    const STOPPED = stoppedClasses || ['white'];

    let classNames = [
      ...additionalClasses,
    ];

    classNames = (this.state.timerRunning)
      ? [...classNames, ...RUNNING]
      : [...classNames, ...STOPPED];

    return classNames.join(' ');
  }

  cardTextClass(additionalClasses = [''], runningClasses = null, stoppedClasses = null) {
    const RUNNING = runningClasses || ['white'];
    const STOPPED = stoppedClasses || ['grey', 'darken-1'];

    let classNames = [
      ...additionalClasses,
    ];

    const textModifier = (color) => {
      return (color.indexOf('darken') === 0 || color.indexOf('lighten') === 0)
        ? `text-${color}`
        : `${color}-text `;
    }

    classNames = (this.state.timerRunning)
      ? [...classNames, ...RUNNING.map(color => textModifier(color))]
      : [...classNames, ...STOPPED.map(color => textModifier(color))];

    return classNames.join(' ');
  }

  timerCardStyle() {
    return {
      margin: 0,
    }
  }

  descriptionStyle() {
    return {
      borderColor: '#29b6f6'
    }
  }

  render() {
    return (
      <section
        className="time-card">
        <div
          id={this.props.id}
          draggable="true"
          onDrag={this.props.handleOrderOnDrag}
          onDragStart={this.props.handleOrderOnDragStart}
          onDragEnd={this.props.handleOrderOnDragEnd}
          style={this.timerCardStyle()}
          className={this.cardClass(['card', 'z-depth-0'])}>
          <div className={this.cardTextClass(["card-content"], ['grey', 'darken-3']) + this.cardClass([''], ['light-blue', 'lighten-4'])}>
            <span className="card-title">
              <span>{this.state.title || this.id}</span>
            </span>
            <blockquote style={this.descriptionStyle()} className="card-description">
              {this.state.description
                ? this.state.description.split('\n').map((string, idx) => <p key={idx}>{string}</p>)
                : ''}
            </blockquote>
            <div className="card-meta">
              Created {this.formatTimerDate()}
            </div>
          </div>
          <div className="card-action">
            <Timer time={this.state.timeProgress} running={this.state.timerRunning} />
            <button disabled={this.state.timerRunning} onClick={this.startTimer} className={this.cardTextClass(["btn-flat"])}>
              <i className="material-icons">play_arrow</i></button>
            <button disabled={!this.state.timerRunning} onClick={this.pauseTimer} className={this.cardTextClass(["btn-flat"])}>
              <i className="material-icons">stop</i></button>
            <button onClick={this.resetTimer} className={this.cardTextClass(["btn-flat"])}>
              <i className="material-icons">refresh</i></button>
            <button onClick={this.removeTimer} className={this.cardTextClass(["btn-flat"])}>
              <i className="material-icons">delete_forever</i></button>
            <button className={this.cardTextClass(["btn-flat", "modal-trigger"])} data-target={'modal-' + this.id} >
              <i className="material-icons">edit</i></button>
          </div>
        </div>
        <div id={'modal-' + this.id} ref={this.modalRef} className="modal">
          <div className="modal-content">
            <div className="row">
              <h5>Edit Timer</h5>
            </div>
            {this.editForm()}
          </div>
          <div className="modal-footer">
            <div className="left">
              <Timer
                time={this.state.timeProgress}
                running={this.state.timerRunning}
                caption={this.state.timerRunning ? '- Running' : '- Stopped'}/>
            </div>
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Done</a>
          </div>
        </div>
      </section>
    )
  }
};
