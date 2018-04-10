import React, { Component } from 'react';

export default class Controls extends Component {
  constructor(props) {
    super(props);
    this.addTimer = this.addTimer.bind(this);
  }

  addTimer() {
    let uid = +`${Math.floor(Math.random() * 1000)}${+new Date()}`;
    this.props.onTimerAdd({
      timerState: {},
      id: `timer-${uid}`
    });
  }

  render() {
    return (
      <div className="timer-controls">
        <button onClick={this.addTimer}>Add Timer</button>
      </div>
    );
  }
}