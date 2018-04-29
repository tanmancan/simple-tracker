import React, { Component } from 'react';

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

        return this.pickerInstance
    }
  }

  get prevDay() {
    let startDate = new Date(this.state.currentDay);
    let day = startDate.getDate();

    startDate.setDate(day - 1);

    return startDate;
  }

  get nextDay() {
    let startDate = new Date(this.state.currentDay);
    let day = startDate.getDate();

    startDate.setDate(day + 1);

    return startDate;
  }

  get isToday() {
    console.log(this.nextDay.getTime() > this.state.today.getTime());
    return this.nextDay.getTime() > this.state.today.getTime();
  }

  selectDate(date) {
    this.props.setDateFilter(date);
    this.setState({
      currentDay: date
    })
  }

  datePick() {
    this.picker.setDate(this.state.currentDay);
    this.picker.open();
  }

  goPrevDay() {
    this.setState((state, props) => {
      this.props.setDateFilter(this.prevDay);
      return {
        currentDay: this.prevDay
      }
    });
  }

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
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    }
    return date.toLocaleDateString('en-US', dateOpts);
  }


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
