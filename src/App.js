import React, { Component } from 'react';
import TimeCardListBuilder from './components/TimeCardListBuilder';
import SideNav from './components/SideNav';
import {TagEditorModal} from './containers/TagManager';
import * as pkg from '../package.json';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteOnDrop = this.handleDeleteOnDrop.bind(this);
    this.handleDeleteOnDragOver = this.handleDeleteOnDragOver.bind(this);
    this.handleSearchQuery = this.handleSearchQuery.bind(this);
    this.state = {
      timerSearchQuery: ''
    }
  }

  componentDidMount() {
    window.M.AutoInit();
    window.showToast = (msg = '', opts = {}) => {
      window.M.toast({
        html: `${msg}`,
        displayLength: 2000,
        ...opts
      });
    }

  }

  SideNav() {
    return React.createElement(
      SideNav, {
        ...this.props
      }
    );
  }

  listBuilder() {
    return React.createElement(
      TimeCardListBuilder, {
        ...this.props,
        timerSearchQuery: this.state.timerSearchQuery
      }
    );
  }

  handleDeleteOnDrop(e) {
    e.preventDefault();

    let payload = JSON.parse(e.dataTransfer.getData('application/json') || '{}');

    if (Object.keys(payload).length > 0 && payload.type === 'TIMER_ORDER') {
      this.props.onTimerDelete({
        id: payload.id,
        timerState: this.props.getAllTimerStates[payload.id],
      });

      this.props.onTimerDrag({
        dragState: false,
        id: payload.id
      });
    }
  }

  handleDeleteOnDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"
  }

  handleSearchQuery(e) {
    let timerSearchQuery = e.target.value;

    this.setState({
      timerSearchQuery
    });
  }

  appStyle() {
    return {
      height: '100vh'
    }
  }

  searchNoMarginBottom() {
    return {
      marginBottom: 0
    }
  }

  render() {
    return (
      <div className="App" style={this.appStyle()}>
        {this.SideNav()}
        <main>
          <div
            onDrop={this.handleDeleteOnDrop}
            onDragOver={this.handleDeleteOnDragOver}
            className="fixed-action-btn">
            <a onClick={this.props.onTimerAdd}
              className={'btn-floating btn-large z-depth-0 ' + ((this.props.getDragState) ? 'red' : 'light-blue')}>
              <i className="large material-icons">{(this.props.getDragState) ? 'delete' : 'add'}</i>
            </a>
          </div>
          <div className="row">
            <div className="nav-wrapper">
              <nav className="top-nav z-depth-0">
                <div className="nav-wrapper red">
                  <div className="col s12">
                    <a href="#open-menu" data-target="slide-out" className="sidenav-trigger white-text"><i className="material-icons">menu</i></a>
                    <a href="/" className="brand-logo center white-text lighten-4-text">React-Timer</a>
                  </div>
                </div>
              </nav>
            </div>

            <div className="row" style={this.searchNoMarginBottom()}>
              <form className="col s12">
                <div className="row" style={this.searchNoMarginBottom()}>
                  <div className="input-field col s12" style={this.searchNoMarginBottom()}>
                    <i className="material-icons prefix">search</i>
                    <input id="icon_prefix" type="text" className="validate" onChange={this.handleSearchQuery}/>
                    <label htmlFor="icon_prefix">Search timers by name, description, tags or start time</label>
                  </div>
                </div>
              </form>
            </div>

            {this.listBuilder()}
          </div>
          <TagEditorModal></TagEditorModal>
          <footer className="page-footer grey lighten-2">
              <div className="row footer-content">
                <div className="col l6 s12">
                <h6 className="grey-text text-darken-1">
                <span style={{textTransform:'capitalize'}}>{pkg.name.replace(/-/g, ' ')}</span>
                <small> ( {pkg.version} )</small></h6>
                <p className="grey-text">{pkg.description}</p>
                </div>
                <div className="col l4 offset-l2 s12">
                  <ul>
                    <li><a className="grey-text" target="_blank" rel="noopener noreferrer" href={pkg.homepage}>View on Github</a></li>
                    <li><a className="grey-text" target="_blank" rel="noopener noreferrer" href={pkg.bugs.url}>Report an Issue</a></li>
                  </ul>
                </div>
              </div>
            <div className="footer-copyright grey-text">
              &copy; {new Date().getFullYear()} Tanveer Karim. <a className="grey-text" style={{padding:'0 .25rem'}} target="_blank" rel="noopener noreferrer" href="http://www.tkarimdesign.com">www.tkarimdesign.com</a>
            </div>
          </footer>
        </main>
      </div>
    );
  }
}

export default App;
