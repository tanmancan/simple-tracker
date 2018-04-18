import React, { Component } from 'react';
import TimeCardListBuilder from './components/TimeCardListBuilder';
import SideNav from './components/SideNav';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteOnDrop = this.handleDeleteOnDrop.bind(this);
    this.handleDeleteOnDragOver = this.handleDeleteOnDragOver.bind(this);
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
        ...this.props
      }
    )
  }

  handleDeleteOnDrop(e) {
    let payload = JSON.parse(e.dataTransfer.getData('application/json'));

    this.props.onTimerDelete({
      id: payload.id,
      timerState: {},
    });

    this.props.onTimerDrag({
      dragState: false,
      id: payload.id
    });
  }

  handleDeleteOnDragOver(e) {
    e.preventDefault();
  }

  getDragState() {

  }

  appStyle() {
    return {
      height: '100vh'
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
              className={'btn-floating btn-large ' + ((this.props.getDragState) ? 'red' : 'light-blue')}>
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
            {this.listBuilder()}
          </div>
          <footer className="page-footer grey lighten-2">
              <div className="row footer-content">
                <div className="col l6 s12">
                <h6 className="grey-text text-darken-1">React Timer</h6>
                  <p className="grey-text">Simple timer app built using React and Redux.</p>
                </div>
                <div className="col l4 offset-l2 s12">
                  <ul>
                    <li><a className="grey-text" href="#!">View on Github</a></li>
                    <li><a className="grey-text" href="#!">Report an Issue</a></li>
                  </ul>
                </div>
              </div>
            <div className="footer-copyright grey-text">
              &copy; {new Date().getFullYear()} Tanveer Karim. <a className="grey-text" style={{padding:'0 .25rem'}} href="http://www.tkarimdesign.com">www.tkarimdesign.com</a>
            </div>
          </footer>
        </main>
      </div>
    );
  }
}

export default App;
