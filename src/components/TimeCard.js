import React, { Component } from 'react';
import {initState} from '../store/reducers';

export default class TimeCard extends Component {
  constructor(props) {
    super(props);
    this.raf = window.requestAnimationFrame;
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.initState = initState;
    this.id = this.props.id;
    this.state = this.props.getStateById(this.id);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.state.rafId);
  }

  timerRun() {
    let state = this.props.getStateById(this.id);
    let timeStart = +new Date();
    let timeProgress = (timeStart - state.timeStart) + state.timeProgress;
    let timerActive = (state.timerRunning && this.id.indexOf(this.props.getActiveTimer) === 0);
    let rafId = timerActive
      ? this.raf.call(window, () => this.timerRun())
      : null;

    let timerState = {
      ...state,
      timeStart,
      timeProgress,
      rafId,
      timerRunning: timerActive
    };

    this.props.onTimerUpdate({
      timerState,
      id: this.id
    });
    this.setState(timerState);
  }

  startTimer() {
    let state = this.props.getStateById(this.id);
    let rafId = this.raf.call(window, () => this.timerRun());
    let timerState = {
      ...state,
      rafId,
      timerRunning: true,
      timeStart: +new Date(),
    }

    this.props.onTimerUpdate({
      timerState,
      id: this.id
    });
    this.setState(timerState);
  }

  pauseTimer() {
    let state = this.props.getStateById(this.id);
    let timerState = {
      ...state,
      timerRunning: false
    };

    this.props.onTimerUpdate({
      timerState,
      id: this.id
    });
    this.setState(timerState);
  }

  resetTimer() {
    let state = this.props.getStateById(this.id);
    cancelAnimationFrame(state.rafId);
    this.props.onTimerUpdate({
      timerState: this.initState,
      id: this.id
    });
    this.setState((state, props) => this.initState);
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

  render() {
    return (
      <section className="time-card">
        <h1>{this.props.id}</h1>
        <p>
          {this.formatTime(this.state.timeProgress)}
        </p>
        <button disabled={this.state.timerRunning} onClick={this.startTimer}>Start Timer</button>
        <button disabled={!this.state.timerRunning} onClick={this.pauseTimer}>Pause Timer</button>
        <button onClick={this.resetTimer}>Reset Timer</button>
      </section>
    )
  }
};
