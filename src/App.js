import React, { Component } from 'react';
import TimeCardListBuilder from './components/TimeCardListBuilder';
import ImportExportModal from './components/ImportExportModal';
import SideNav from './components/SideNav';
import GaScript from './components/GaScript';
import DateFilter from './components/DateFilter';
import Guide from './guide/Guide';
import {TagEditorModal} from './containers/TagManager';
import * as pkg from '../package.json';
import './App.css';
/**
 * Main app component
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteOnDrop = this.handleDeleteOnDrop.bind(this);
    this.handleDeleteOnDragOver = this.handleDeleteOnDragOver.bind(this);
    this.handleSearchQuery = this.handleSearchQuery.bind(this);
    this.handleUsageGuide = this.handleUsageGuide.bind(this);
    this.setDateFilter = this.setDateFilter.bind(this);
    this.datePickerRef = React.createRef();
    this.sideNavRef = React.createRef();
    this.state = {
      timerSearchQuery: '',
      showUsageGuide: false,
      currentDate: new Date(new Date().setHours(0, 0, 0, 0)),
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
    if (window.location.hash === '#usage-guide') {
      this.setState({
        showUsageGuide: true
      })
    }
  }

  setDateFilter(date) {
    this.setState({
      currentDate: date
    })
  }

  /**
   * Creates the side navigation component.
   *
   * @returns {ReactElement}
   * @memberof App
   */
  SideNav() {
    return React.createElement(
      SideNav, {
        ...this.props,
        handleUsageGuide: this.handleUsageGuide,
        showUsageGuide: this.state.showUsageGuide,
        currentDate: this.state.currentDate,
        sideNavRef: this.sideNavRef,
      }, null
    );
  }

  /**
   * Creates component displaying a list of timers
   *
   * @returns {ReactElement}
   * @memberof App
   */
  listBuilder() {
    return React.createElement(
      TimeCardListBuilder, {
        ...this.props,
        timerSearchQuery: this.state.timerSearchQuery,
        currentDate: this.state.currentDate,
      }, null
    );
  }

  /**
   * Creates component for the export/import data component.
   *
   * @returns {ReactElement}
   * @memberof App
   */
  importExportModalBuilder() {
    return React.createElement(
      ImportExportModal, {
        ...this.props
      },null
    )
  }

  /**
   * Handler for ondrop event when dragging and dropping a timer into the floating action button
   *
   * @param {SyntheticEvent} e React's ondrop event wrapper
   * @memberof App
   */
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

  /**
   * Handler for ondragover event for the floating action button.
   *
   * @param {SyntheticEvent} e React's ondragover event wrapper
   * @memberof App
   */
  handleDeleteOnDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"
  }

  /**
   * Handler for onchange event attached to the search filter input
   *
   * @param {SyntheticEvent} e React's onchange event wrapper
   * @memberof App
   */
  handleSearchQuery(e) {
    let timerSearchQuery = e.target.value;

    this.setState({
      timerSearchQuery
    });
  }

  /**
   * Handler for navigational click event for showing or hiding the usage guide
   *
   * @param {string} action String literal indicating if we want to hide, show, or toggle usage guide visibility
   * @memberof App
   */
  handleUsageGuide(action) {
    let sideNavInstance = window.M.Sidenav.getInstance(this.sideNavRef.current);

    if (sideNavInstance && sideNavInstance.lastWindowWidth < 992) {
      sideNavInstance.close();
    }

    switch (action) {
      case 'SHOW': {
        this.setState({
          showUsageGuide: true,
        });
        break;
      }
      case 'HIDE': {
        this.setState({
          showUsageGuide: false,
        });
        break;
      }
      case 'TOGGLE': {
        this.setState((state) => {
          return {
            showUsageGuide: !state.showUsageGuide
          }
        });
        break;
      }
      default: {
        this.setState({
          showUsageGuide: false,
        });
        break;
      }
    }
  }

  /**
   * @todo Refactor how inline styles are managed
   * @memberof App
   */
  appStyle() {
    return {
      height: '100vh'
    }
  }

  /**
   * @todo Refactor how inline styles are managed
   * @memberof App
   */
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
            tabIndex="7"
            onDrop={this.handleDeleteOnDrop}
            onDragOver={this.handleDeleteOnDragOver}
            className={"fixed-action-btn " + (this.state.showUsageGuide ? 'hide' : '')}>
            <a onClick={(e) => {
              this.props.onTimerAdd({
                timerStartDate: +new Date(this.state.currentDate),
              });
            }}
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
                    <DateFilter
                      getAllTimers={this.props.getAllTimers}
                      getAllTimerStates={this.props.getAllTimerStates}
                      setDateFilter={this.setDateFilter}
                      datePickerRef={this.datePickerRef}/>
                  </div>
                </div>
              </nav>
            </div>

            <div className={"row " + (this.state.showUsageGuide ? 'hide' : '')} style={this.searchNoMarginBottom()}>
              <form className="col s12">
                <div className="row" style={this.searchNoMarginBottom()}>
                  <div className="input-field col s12" style={this.searchNoMarginBottom()}>
                    <i className="material-icons prefix">search</i>
                    <input tabIndex="1" id="icon_prefix" type="text" className="validate" onChange={this.handleSearchQuery}/>
                    <label htmlFor="icon_prefix">Search timers</label>
                  </div>
                </div>
              </form>
            </div>

            {(!this.state.showUsageGuide)
              ? this.listBuilder()
              : null}

            {(this.state.showUsageGuide)
              ? <Guide handleUsageGuide={this.handleUsageGuide} showUsageGuide={this.state.showUsageGuide} />
              : null}
          </div>

          <TagEditorModal></TagEditorModal>
          {this.importExportModalBuilder()}

          <footer className="page-footer grey lighten-2">
              <div className="row footer-content">
                <div className="col l6 s12">
                <h6 className="grey-text text-darken-2">
                <span style={{textTransform:'capitalize'}}>{pkg.name.replace(/-/g, ' ')}</span>
                <small> ( {pkg.version} )</small></h6>
                <p className="grey-text text-darken-2">{pkg.description}</p>
                </div>
                <div className="col l4 offset-l2 s12">
                  <ul>
                    <li><a className="grey-text text-darken-2" target="_blank" rel="noopener noreferrer" href={pkg.repository.url.replace(/(git\+)|(.git)$/g,'')}>View on Github</a></li>
                    <li><a className="grey-text text-darken-2" target="_blank" rel="noopener noreferrer" href={pkg.bugs.url}>Report an Issue</a></li>
                  </ul>
                </div>
              </div>
            <div className="footer-copyright grey-text text-darken-2">
              &copy; {new Date().getFullYear()} Tanveer Karim. <a className="grey-text text-darken-2" style={{padding:'0 .25rem'}} target="_blank" rel="noopener noreferrer" href="http://www.tkarimdesign.com">www.tkarimdesign.com</a>
            </div>
          </footer>
        </main>
        <GaScript />
        <input style={{marginLeft:'300px'}} ref={this.datePickerRef} type="hidden" className="pickdate"/>
      </div>
    );
  }
}

export default App;
