import React, { Component } from 'react';
import TimeCard from './TimeCard';
const e = React.createElement;

export default class TimeCardListBuilder extends Component {
  constructor(props) {
    super(props);
    this.sortByWeight = this.sortByWeight.bind(this);
    this.timeCardBuilder = this.timeCardBuilder.bind(this);
  }

  sortByWeight() {
    return this;
  }

  dragDividerStyle() {
    return {
      width: '100%',
      height: '1rem'
    }
  }

  timeCardBuilder(id, idx) {
    return (
      e('div', { id: `card-wrapper-${id}`, key: `card-wrapper-${id}` },
        e('div', {
            className: 'drag-divider',
            id: `card-divider-${id}`,
            key: `card-divider-${id}`,
            style: this.dragDividerStyle(),
          }, null
        ),
        e(
          TimeCard, {
            ...this.props,
            id,
            key: id,
            weight: idx,
            appModal: this.props.appModal,
          }, null
        )
      )
    );
  }

  render() {
    return (
      <div className="timers">
        <div className="timer-list">

          {
            this.props.getAllTimers.map(
              (id, idx) => this.timeCardBuilder(id, idx)
            )
          }
        </div>
      </div>
    );
  }
}
