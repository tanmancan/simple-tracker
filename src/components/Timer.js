import React, {Component} from 'react';

/**
 * Creates a human readable time string when provided time
 *
 * @export
 * @param {number} [milliseconds=0] Timestamp in milliseconds
 * @returns {string} Formatted time in hour, minutes and seconds
 */
export const formatTime = (milliseconds = 0) => {
  let time = milliseconds / 1000;
  const converter
    = (denom = 1) => ((time / denom) % 60 < 10 || (time / denom) % 60 === 60)
      ? `0${Math.floor(time / denom) % 60}`
      : `${Math.floor(time / denom) % 60}`;

  let sec = converter(1);
  let min = converter(60);
  let hr = converter(3600);

  return `${hr}h : ${min}m : ${sec}s`;
}

/**
 * Component that formats and displays the accrued time for a timer
 *
 * @class TimerComponent
 * @extends {Component}
 */
class TimerComponent extends Component {
  constructor(props) {
    super(props);
    this.timerState = this.timerState.bind(this);
    this.formatTime = formatTime.bind(this);
  }

  /**
   * Returns styling classes based on timer running state
   *
   * @param {bool} [timerRunning=this.props.running] Indicates if a timer is running or stopped
   * @returns {string} String literals containing computed class names
   * @memberof TimerComponent
   */
  timerState(timerRunning = this.props.running) {
    const RUNNING = ['blue', 'darken-4'];
    const STOPPED = (this.props.time === 0)
      ? ['grey', 'lighten-1']
      : ['grey', 'darken-1'];

    let classNames = [
      'badge',
      'new'
    ];

    classNames = (timerRunning)
      ? [...classNames, ...RUNNING]
      : [...classNames, ...STOPPED];

    return classNames.join(' ');
  }

  /**
   * Overrides default styles for component badge
   *
   * @returns {Object} Style properties to apply to and element
   * @memberof TimerComponent
   */
  style() {
    let styles = {
      fontSize: '1rem',
      padding: '.25rem 1rem',
      height: 'auto',
      float: 'none',
      ...this.props.additionalStyle
    };

    return styles;
  }

  render() {
    return (
      <span
        data-badge-caption={this.props.caption || ''}
        style={this.style()}
        className={this.timerState()}>{this.formatTime(this.props.time)}</span>
    );
  }
}

export const Timer = TimerComponent;
