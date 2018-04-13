import React, { Component } from 'react';
import {formatTime} from './Timer';

export default class Controls extends Component {
  constructor(props) {
    super(props);
    this.addTimer = this.addTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    console.log(formatTime(this.props.getTotalTime));
  }

  addTimer() {
    let uid = +`${Math.floor(Math.random() * 1000)}${+new Date()}`;
    this.props.onTimerAdd({
      timerState: {},
      id: `timer-${uid}`
    });
  }

  stopTimer() {
    console.log(this.props.getAllTimerStates[this.props.getActiveTimer[0]]);
    this.props.onTimerStop({
      timerState: this.props.getAllTimerStates[this.props.getActiveTimer[0]],
      id: this.props.getActiveTimer[0]
    });
  }

  render() {
    return (
      <ul id="slide-out" className="sidenav sidenav-fixed z-depth-0">
        <li>
          <div className="user-view">
            <div className="background red">
            </div>
            <a href="/">
              <i className="material-icons circle white red-text sidenav-logo">alarm</i>
            </a>
            <a href="/"><span className="white-text name">React-Timer</span></a>
            <a href="https://www.tkarimdesign.com"><span className="white-text email">www.tkarimdesign.com</span></a>
            <a href="#total-time">
              <span className="white-text">Total – {formatTime(this.props.getTotalTime)}</span>
            </a>
          </div>
        </li>
        <li>
          <a onClick={this.addTimer} className="brown-text lighten-4-text">
            <i className="material-icons">add_alarm</i>
            Add Timer
          </a>
        </li>
        <li>
          <a onClick={this.stopTimer} className="brown-text lighten-4-text">
            <i className="material-icons">alarm_off</i>
            Stop Timer
          </a>
        </li>
        <li><div className="divider"></div></li>
      </ul>
    );
  }
}
