import React, { Component } from 'react';
import { formatTime } from './Timer';

export default class SideNavHeader extends Component {
  constructor(props) {
    super(props);
    this.url = 'https://www.tkarimdesign.com'
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
          <a href="/"><span className="white-text name">React-Timer</span></a>
          <a href={this.url}><span className="white-text email">{this.url}</span></a>
          <a>
            <span className="white-text">Total – {formatTime(this.props.getTotalTime)}</span>
          </a>
        </div>
      </li>
    );
  }
}
