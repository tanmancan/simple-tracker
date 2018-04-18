import React, { Component } from 'react';
import SideNavHeader from './SideNavHeader';

export default class SideNav extends Component {
  constructor(props) {
    super(props);
    this.addTimer = this.addTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  addTimer() {
    this.props.onTimerAdd();
  }

  stopTimer() {
    this.props.onTimerStop({
      timerState: this.props.getAllTimerStates[this.props.getActiveTimer[0]],
      id: this.props.getActiveTimer[0]
    });
  }

  render() {
    return (
      <ul id="slide-out" className="sidenav sidenav-fixed z-depth-0">
        <SideNavHeader getTotalTime={this.props.getTotalTime}></SideNavHeader>
        <li>
          <a href="#add-timer" onClick={this.addTimer} className="brown-text lighten-4-text">
            <i className="material-icons">add_alarm</i>
            Add Timer
          </a>
        </li>
        <li>
          <a href="#stop-timer" onClick={this.stopTimer} className="brown-text lighten-4-text">
            <i className="material-icons">alarm_off</i>
            Stop Timer
          </a>
        </li>
        <li><div className="divider"></div></li>
      </ul>
    );
  }
}
