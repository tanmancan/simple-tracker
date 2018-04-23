import React, { Component } from 'react';
import SideNavHeader from './SideNavHeader';
import {TagList} from '../containers/TagManager';

export default class SideNav extends Component {
  constructor(props) {
    super(props);
    this.addTimer = this.addTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  addTimer() {
    this.props.onTimerAdd();
  }

  stopTimer() {
    this.props.onTimerStop({
      timerState: this.props.getAllTimerStates[this.props.getActiveTimer[0]],
      id: this.props.getActiveTimer[0]
    });
  }

  render() {
    return (
      // @TODO: clean this up, improve usage guide navigation
      <ul id="slide-out" className="sidenav sidenav-fixed z-depth-0">
        <SideNavHeader getTotalTime={this.props.getTotalTime}></SideNavHeader>
        <li>
          <a
            href="#add-timer"
            onClick={(e) => {
              this.props.handleUsageGuide('CLOSE');
              this.addTimer();}} className="brown-text lighten-4-text">
            <i className="material-icons">add_alarm</i>
            Add Timer
          </a>
        </li>
        <li>
          <a
            href="#stop-timer"
            onClick={(e) => {
              this.props.handleUsageGuide('CLOSE');
              this.stopTimer();}} className="brown-text lighten-4-text">
            <i className="material-icons">alarm_off</i>
            Stop Timer
          </a>
        </li>
        <li>
          <a
            onClick={(e) => {
              window.location.hash = '#import-export';
              this.props.handleUsageGuide('CLOSE')
            }}
            href="#modal-import-export"
            className="brown-text lighten-4-text modal-trigger">
            <i className="material-icons">archive</i>
            Import/Export Data
          </a>
        </li>
        <li>
          <a
            onClick={(e) => {
              window.location.hash = '#edit-tags';
              this.props.handleUsageGuide('CLOSE')}}
            href="#modal-manage-tag"
            className="brown-text lighten-4-text modal-trigger">
            <i className="material-icons">settings</i>
            Edit Tags/Category
          </a>
        </li>
        <li>
          <a href={"#" + (this.props.showUsageGuide ? 'usage-guide' : '!')} className="brown-text lighten-4-text" onClick={(e) => { this.props.handleUsageGuide('TOGGLE')}}>
            <i className="material-icons">help_outline</i>
            Usage Guide
          </a>
        </li>
        <li><div className="divider"></div></li>
        <TagList></TagList>
      </ul>
    );
  }
}
