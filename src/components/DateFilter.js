import React, { Component } from 'react';

/**
 * Component for filtering timer list by date
 *
 * @export
 * @class DateFilter
 * @extends {Component}
 */
export default class DateFilter extends Component {
  constructor(props) {
    super(props);
    this.goPrevDay = this.goPrevDay.bind(this);
    this.goNextDay = this.goNextDay.bind(this);
    this.datePick = this.datePick.bind(this);
    this.selectDate = this.selectDate.bind(this);
    this.state = {
      today: new Date(),
      currentDay: new Date(),
    }
  }

  /**
   * Get instance of date picker, if non exists create a new one.
   *
   * @readonly
   * @memberof DateFilter
   */
  get picker() {
    if (this.props.datePickerRef.current) {
      let pickerOpts = {
        defaultDate: this.state.currentDay,
        onSelect: this.selectDate,
        maxDate: this.state.today,
      };

      this.pickerInstance = (this.pickerInstance)
        ? this.pickerInstance
        : window.M.Datepicker.init(this.props.datePickerRef.current, pickerOpts);

      this.pickerInstance.options.events = this.props.getAllTimers
        .map(
          id => new Date(this.props.getAllTimerStates[id].timerStartDate).toDateString()
        );

      return this.pickerInstance
    }
  }

  /**
   * Get the previous date based on state.currentDay
   *
   * @readonly
   * @memberof DateFilter
   */
  get prevDay() {
    let startDate = new Date(this.state.currentDay);
    let day = startDate.getDate();

    startDate.setDate(day - 1);

    return startDate;
  }

  /**
   * Get the next day based on state.currentDay
   *
   * @readonly
   * @memberof DateFilter
   */
  get nextDay() {
    let startDate = new Date(this.state.currentDay);
    let day = startDate.getDate();

    startDate.setDate(day + 1);

    return startDate;
  }

  /**
   * Used to test if selected date is today, to disabled users from selecting the next day
   *
   * @readonly
   * @memberof DateFilter
   */
  get isToday() {
    return this.nextDay.getTime() > this.state.today.getTime();
  }

  /**
   * Callback for date picker selection
   *
   * @param {any} date The selected date passed from the date picker
   * @memberof DateFilter
   */
  selectDate(date) {
    this.props.setDateFilter(date);
    this.setState({
      currentDay: date
    })
    this.picker.close();
  }

  /**
   * Opens the date picker and sets currentDay to selected date
   *
   * @memberof DateFilter
   */
  datePick() {
    this.picker.setDate(this.state.currentDay);
    this.picker.open();
  }

  /**
   * Navigate to the previous day
   *
   * @memberof DateFilter
   */
  goPrevDay() {
    this.setState((state, props) => {
      this.props.setDateFilter(this.prevDay);
      return {
        currentDay: this.prevDay
      }
    });
  }

  /**
   * Navigate to the next day
   *
   * @memberof DateFilter
   */
  goNextDay() {
    this.setState((state, props) => {
      this.props.setDateFilter(this.nextDay);
      return {
        currentDay: this.nextDay
      }
    });
  }

  /**
   * Get current date in a readable format
   *
   * @memberof DateFilter
   */
  formatDate(date = this.state.currentDay) {
    let dateOpts = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    }
    return date.toLocaleDateString('en-US', dateOpts);
  }


  /**
   * Custom disabled button style to avoid styling conflicts with navbar defaults
   *
   * @readonly
   * @memberof DateFilter
   */
  get disabledButtonStyle() {
    return (this.isToday)
    ? {
      pointerEvents: 'none',
      cursor: 'default',
      opacity: .5,
      backgroundColor: 'transparent',
    }
    : {};
  }

  render() {
    return (
      <div className="date-filter brand-logo center white-text lighten-4-text">
        <a href="#!"
          style={{padding:0,margin:'0 .5rem'}}
          onClick={this.goPrevDay}
          className="white-text btn-flat">
          <i
            style={{height:'inherit',lineHeight:'inherit',margin:0}}
            className="material-icons">chevron_left</i></a>
        <a href="#!"
          style={{
            padding: 0,
            margin: '0 .5rem',
            height: '54px',
            lineHeight: '54px',
            fontSize: '15px',
            letterSpacing: '.5px',
          }}
          onClick={this.datePick}
          className="white-text btn-flat">
          <i
            style={{ height: 'inherit', lineHeight: 'inherit', margin:0}}
            className="material-icons">date_range</i>
            <span
              style={{margin: '0 0 0 1rem'}}
              className="hide-on-small-only">{this.formatDate()}</span>
        </a>
        <a href="#!"
          style={{
            padding: 0,
            margin: '0 .5rem',
            ...this.disabledButtonStyle
          }}
          onClick={this.goNextDay}
          className="white-text btn-flat">
          <i
            style={{ height: 'inherit', lineHeight: 'inherit',margin:0 }}
            className="material-icons right">chevron_right</i></a>
      </div>
    )
  }
}
