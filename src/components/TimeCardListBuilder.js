import React, { Component } from 'react';
import TimeCard from './TimeCard';
import Controls from './Controls';

export default class TimeCardListBuilder extends Component {
  constructor(props) {
    super(props);
    this.sortByWeight = this.sortByWeight.bind(this);
  }

  controls() {
    return React.createElement(
      Controls, {
        ...this.props
      }
    );
  }

  sortByWeight() {
    return this;
  }

  render() {
    return (
      <div className="timers">
        <div className="timer-list">
          {
            this.props.getAllTimers.map(
              (id, idx) => React.createElement(
                TimeCard, {
                  ...this.props,
                  id,
                  key: id,
                  weight: idx
                }
              )
            )
          }
        </div>
      </div>
    );
  }
}
