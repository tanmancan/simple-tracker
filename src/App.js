import React, { Component } from 'react';
import TimeCardListBuilder from './components/TimeCardListBuilder';
import SideNav from './components/SideNav';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.sortByWeight = this.sortByWeight.bind(this);
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

  sortByWeight() {
    return this;
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
          <div className="row">
            <div className="col s12">
              {this.listBuilder()}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
