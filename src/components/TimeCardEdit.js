import React, { Component } from 'react';

export default class TimeCardEdit extends Component {
  constructor(props) {
    super(props);
    this.timeoutId = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.state = {
      title: props.title,
      description: props.description
    }
  }

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

  handleOnFocus(e) {
    e.target.setSelectionRange(0, -1);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="input-field">
            <input
              placeholder="Enter Timer Name"
              id={"title" + this.props.id} type="text"
              className="timer-name"
              onChange={this.handleChange}
              onFocus={this.handleOnFocus}
              value={this.state.title}/>
            <label className="active" htmlFor={"title" + this.props.id}>Timer Name</label>
          </div>
        </div>

        <div className="row">
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
    )
  }
}
