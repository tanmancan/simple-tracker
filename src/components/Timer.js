import React, {Component} from 'react';

export const formatTime = (milliseconds = 0) => {
  let time = milliseconds / 1000;
  const converter
    = (denom = 1) => ((time / denom) % 60 < 10 || (time / denom) % 60 === 60)
      ? `0${Math.floor(time / denom) % 60}`
      : `${Math.floor(time / denom) % 60}`;

  let sec = converter(1);
  let min = converter(60);
  let hr = converter(3600);

  return `${hr}h ${min}m ${sec}s`;
}

class TimerComponent extends Component {
  constructor(props) {
    super(props);
    this.timerState = this.timerState.bind(this);
    this.formatTime = formatTime.bind(this);
  }

  timerState(timerRunning = this.props.running) {
    const RUNNING = ['blue', 'darken-4'];
    const STOPPED = ['grey'];

    let classNames = [
      'badge',
      'new'
    ];

    classNames = (timerRunning)
      ? [...classNames, ...RUNNING]
      : [...classNames, ...STOPPED];

    return classNames.join(' ');
  }

  style() {
    return {
      fontSize: '1rem',
      padding: '.25rem 1rem',
      height: 'auto'
    }
  }

  render() {
    return (
      <span data-badge-caption={this.props.caption} style={this.style()} className={this.timerState()}>{this.formatTime(this.props.time)}</span>
    );
  }
}

export const Timer = TimerComponent;
