import React, { Component } from 'react';
import { formatTime } from './Timer';

/**
 * Header component for the side nav
 *
 * @export
 * @class SideNavHeader
 * @extends {Component}
 */
export default class SideNavHeader extends Component {
  constructor(props) {
    super(props);
    this.appUrl = 'https://timer.tkarimdesign.com';
  }

  /**
   * Get current date in a readable format
   *
   * @memberof SideNavHeader
   */
  formatDate(date = this.state.currentDay) {
    let dateOpts = {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    }
    return date.toLocaleDateString('en-US', dateOpts);
  }

  render() {
    return (
      <li>
        <div className="user-view">
          <div className="background red">
          </div>
          <a href="/">
            <i className="material-icons circle white red-text sidenav-logo">alarm</i>
          </a>
          <a href={this.appUrl}><span className="white-text name">React-Timer</span></a>
          <a href={this.appUrl}><span className="white-text email">{this.appUrl}</span></a>
          <a>
            <span
              style={{
                lineHeight:'24px',
                display:'block'
              }}
              className="white-text">
              Total time for {this.formatDate(this.props.currentDate)}
            </span>
            <span
              style={{
                lineHeight:'24px',
                display:'block',
                paddingBottom: '1rem',
                fontWeight: 700
              }}
              className="white-text">{formatTime(this.props.getTotalTimeByDate(this.props.currentDate))}</span>
          </a>
        </div>
      </li>
    );
  }
}
