import React, { Component } from 'react';

/**
 * Component that provides editing functionality for a timer
 *
 * @export
 * @class TimeCardEdit
 * @extends {Component}
 */
export default class TimeCardEdit extends Component {
  constructor(props) {
    super(props);
    this.timeoutId = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleTimeEdit = this.handleTimeEdit.bind(this);
    this.titleRef = React.createRef();
    this.state = {
      title: props.title,
      description: props.description,
      hour: this.formatTime(this.props.timeProgress, 3600),
      minute: this.formatTime(this.props.timeProgress, 60),
      second: this.formatTime(this.props.timeProgress, 1),
    }
  }

  /**
   * Handler for onchange event on timer name and description input field
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCardEdit
   */
  handleChange(e) {
    let name = e.target.id.replace(this.props.id,'');
    let value = e.target.value;

    let timerState = {
      ...this.props.getAllTimerStates[this.props.id],
      [name]: value,
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      this.props.handleEditFormUpdate(timerState);
      this.timeoutId = null;
    }, 500);

    this.setState({
      [name]: value
    })
  }

  /**
   * Automatically selects content when an input is clicked on
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCardEdit
   */
  handleOnFocus(e) {
    e.target.setSelectionRange(0, -1);
  }

  /**
   * Handler onchange event for manually editing a time
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCardEdit
   */
  handleTimeEdit(e) {
    let name = e.target.id.replace(this.props.id, '');
    let value = e.target.value;

    let currentState = {
      hour: this.formatTime(this.props.timeProgress, 3600),
      minute: this.formatTime(this.props.timeProgress, 60),
      second: this.formatTime(this.props.timeProgress, 1),
      [name]: value,
    };

    let sec = Number(currentState.second);
    let min = Number(currentState.minute) * 60;
    let hour = Number(currentState.hour) * 3600;

    let calcTimeProgress = (sec + min + hour) * 1000;

    let timerState = {
      timeProgress: calcTimeProgress,
    }

    if (!this.props.timerRunning) {
      this.props.handleEditFormUpdate(timerState);

      this.setState({
        [name]: value
      })
    }
  }

  /**
   * Builds the options for timer edit select drop down
   *
   * @param {number} length How many drop down items to generate
   * @returns {array} List containing drop down options in JSX
   * @memberof TimeCardEdit
   */
  buildTimeOptions(length) {
    let options = [];

    for (let i = 0; i <= length; i++) {
      options.push(
        <option
          value={i}
          key={i}>{i}</option>
      );
    }

    return options;
  }

  /**
   * Calculates and returns elapsed time based on provided criteria
   *
   * @param {number} [milliseconds=0] Time in milliseconds
   * @param {number} [denom=1] Denominator for converting seconds to minutes, hours or other units. 1 = seconds, 60 = minutes, 3600 = hours.
   * @returns {number} Converted elapsed time
   * @memberof TimeCardEdit
   */
  formatTime(milliseconds = 0, denom = 1) {
    let time = milliseconds / 1000;

    const convertedTime = ((time / denom) % 60 < 10 || (time / denom) % 60 === 60)
        ? `0${Math.floor(time / denom) % 60}`
        : `${Math.floor(time / denom) % 60}`;

    return convertedTime;
  }

  /**
   * Creates an autocomplete list showing other timer names that can be used to populate the input.
   *
   * @returns {array} List of timer names that matches current input value.
   * @memberof TimeCardEdit
   */
  autoCompleteListBuilder() {
    const autoCompWrapper = {
      background: 'white',
      width: '100%',
      position: 'absoulte',
      zIndex: 1e3,
      padding: 0,
      margin: 0,
    };

    const autoCompListItem = {

    };

    const autoCompLink = {
      display: 'block',
    };

    // Sort title alphabetically
    const sortTimerTitle = ([idA, timerStateA], [idB, timerStateB]) => {
      let a = timerStateA.title;
      let b = timerStateB.title;

      if (a > b) {
        return 1;
      }

      if (a < b) {
        return -1;
      }

      return 0;
    }

    // Filter based on titles that match query. Relies on sorting to remove duplicate entries
    const filterTimerTitle = (id, timerState, idx, arr) => {
      return (this.titleRef.current === document.activeElement)
        && this.state.title
        && (timerState.title.toLowerCase().indexOf(this.state.title.toLowerCase()) !== -1)
        && (id !== this.props.id)
        // Remove duplicate titles
        && (idx > 0 && arr[idx - 1][1].title !== timerState.title)
    }

    const autoCompItem = Object.entries(this.props.getAllTimerStates)
      .sort(sortTimerTitle)
      .filter(([id, timerState], idx, arr) => filterTimerTitle(id, timerState, idx, arr))
      .map(([id, timerState], idx) => {
        return (<li
          key={idx}
          style={autoCompListItem}>
          <a
            onClick={(e) => {
              let newTimerState = {
                ...this.props.getAllTimerStates[this.props.id],
                title: timerState.title,
              }

              this.props.handleEditFormUpdate(newTimerState);

              this.setState({
                title: timerState.title
              })
            }}
            className="light-blue-text"
            style={autoCompLink}
            href="#!">{timerState.title}</a>
            <div className="divider"></div>
        </li>)
      });

    let autoCompWrapperShow = {}
    if (autoCompItem.length > 0) {
      autoCompWrapperShow = {
        display: 'block',
        opacity: '1',
        transform: 'translate3d(0, 46px, 0)',
      }
    }

    return <ul style={{
      ...autoCompWrapper,
      ...autoCompWrapperShow
    }} className="dropdown-content">{autoCompItem}</ul>
  }

  /**
   * @todo: Refactor this into smaller components
   * @memberof TimeCardEdit
   */
  render() {
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <div className="input-field">
              <input
                placeholder="Enter Timer Name"
                id={"title" + this.props.id} type="text"
                ref={this.titleRef}
                className="timer-name"
                onChange={this.handleChange}
                onFocus={this.handleOnFocus}
                value={this.state.title}/>
              <label className="active" htmlFor={"title" + this.props.id}>Timer Name</label>
              {this.autoCompleteListBuilder()}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <div className="input-field">
              <textarea
                placeholder="Enter Timer Description"
                id={"description" + this.props.id}
                className="materialize-textarea timer-description"
                onChange={this.handleChange}
                onFocus={this.handleOnFocus}
                value={this.state.description}></textarea>
              <label className="active" htmlFor={"description" + this.props.id}>Timer Description</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col 12">
            <h6>Manually Edit Time – Timer Must Be Paused.</h6>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s4">
            <label htmlFor={"hour" + this.props.id} className="active">Hours</label>
            <select
              style={{marginTop:'.5rem',}}
              disabled={this.props.timerRunning}
              type="number"
              className="validate browser-default"
              placeholder="Edit Hours"
              id={"hour" + this.props.id}
              onChange={this.handleTimeEdit}
              onFocus={this.handleFocus}
              value={Number(this.formatTime(this.props.timeProgress, 3600))}>
              <option value="" disabled>Choose your option</option>
              {this.buildTimeOptions(24, this.state.hour)}
            </select>
          </div>
          <div className="input-field col s4">
            <label htmlFor={"minute" + this.props.id} className="active">Minutes</label>
            <select
              style={{marginTop:'.5rem',}}
              disabled={this.props.timerRunning}
              type="number"
              className="validate browser-default"
              placeholder="Edit Minutes"
              id={"minute" + this.props.id}
              onChange={this.handleTimeEdit}
              onFocus={this.handleFocus}
              value={Number(this.formatTime(this.props.timeProgress, 60))}>
              <option value="" disabled>Choose your option</option>
              {this.buildTimeOptions(60, this.state.hour)}
            </select>
          </div>
          <div className="input-field col s4">
            <label htmlFor={"second" + this.props.id} className="active">Seconds</label>
            <select
              style={{marginTop:'.5rem',}}
              disabled={this.props.timerRunning}
              type="number"
              className="validate browser-default"
              placeholder="Edit Seconds"
              id={"second" + this.props.id}
              onChange={this.handleTimeEdit}
              onFocus={this.handleFocus}
              value={Number(this.formatTime(this.props.timeProgress, 1))}>
              <option value="" disabled>Choose your option</option>
              {this.buildTimeOptions(60, this.state.hour)}
            </select>
          </div>
        </div>
      </div>
    )
  }
}
