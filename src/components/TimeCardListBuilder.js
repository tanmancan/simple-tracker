import React, { Component } from 'react';
import TimeCard from './TimeCard';
import Controls from './Controls';

export default class TimeCardListBuilder extends Component {
  controls() {
    return React.createElement(
      Controls, {
        ...this.props
      }
    );
  }

  render() {
    return (
      <div className="timers">
        <div className="timer-controls">
          {this.controls()}
        </div>
        <div className="timer-list">
          {
            this.props.getAllTimers.map(
              id => React.createElement(
                TimeCard, {
                  ...this.props,
                  id,
                  key: id,
                }
              )
            )
          }
        </div>
      </div>
    );
  }
}