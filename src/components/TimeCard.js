import React, { Component } from 'react';
import {initTimerState} from '../store/reducers/timer';
import TimeCardEdit from './TimeCardEdit';
import {Timer} from './Timer';
import '../styles/TimeCard.scss';

/**
 * Component for a timer
 *
 * @export
 * @class TimeCard
 * @extends {Component}
 */
export default class TimeCard extends Component {
  constructor(props) {
    super(props);
    this.raf = window.requestAnimationFrame;
    this.rafId = null;
    this.modalRef = React.createRef();
    this.timerRef = React.createRef();
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.removeTimer = this.removeTimer.bind(this);
    this.handleEditFormUpdate = this.handleEditFormUpdate.bind(this);
    this.handleTagOnDrop = this.handleTagOnDrop.bind(this);
    this.handleTagOnDragOver = this.handleTagOnDragOver.bind(this);
    this.handleTagOnDragLeave = this.handleTagOnDragLeave.bind(this);
    this.handleTagRemove = this.handleTagRemove.bind(this);
    this.openFormModal = this.openFormModal.bind(this);
    this.initTimerState = initTimerState;
    this.id = this.props.id;
    this.state = {
      ...this.props.getStateById(this.id),
      title: this.props.getStateById(this.id).title || this.props.title || this.props.id,
      description: this.props.getStateById(this.id).description || this.props.description || '',
      tags: this.props.getStateById(this.id).tags || {},
      openEditModal: this.props.getStateById(this.id).openEditModal || false
    };
  }

  componentDidMount() {
    let context = this.timerRef.current;
    if (context !== null) {
      window.M.AutoInit(context);
    }

    this.setState((state, props) => {
      let timerActive = (this.state.timerRunning && this.props.getActiveTimer.indexOf(this.id) === 0);
      this.rafId = timerActive
        ? this.raf.call(window, () => this.timerRun())
        : null;

      if (this.state.openEditModal) {
        let modalInstance = this.modalRef && this.modalRef.current
          ? window.M.Modal.getInstance(this.modalRef.current)
          : null;

        if (modalInstance) {
          modalInstance.open();
          let nameInput = this.modalRef.current.querySelector('.timer-name');
          nameInput.focus();
        }

        let timerState = {
          ...state,
          openEditModal: false
        };

        this.props.onTimerUpdate({
          timerState,
          id: this.id
        })

        return timerState;
      }

    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
  }

  /**
   * Callback for timer animation loop.
   *
   * @memberof TimeCard
   */
  timerRun() {
    let timerState = {};

    this.setState((state, props) => {
      let timeStart = +new Date();
      let timeProgress = (timeStart - state.timeStart) + state.timeProgress;
      let timerActive = (state.timerRunning && this.props.getActiveTimer.indexOf(this.id) === 0);

      timerState = {
        ...state,
        timeStart,
        timeProgress,
        timerRunning: timerActive
      };

      if (timerActive) {
        this.rafId = this.raf.call(window, () => this.timerRun());
      } else {
        cancelAnimationFrame(this.rafId);
        this.props.onTimerUpdate({
          timerState,
          timerRunning: false,
          id: this.id
        });
      }

      return timerState;
    });
  }

  /**
   * Starts a timer
   *
   * @memberof TimeCard
   */
  startTimer() {
    this.setState((state, props) => {
      let timerState = {
        ...this.props.getStateById(this.id),
        timerRunning: true,
        timeStart: +new Date(),
      }

      this.props.onTimerUpdate({
        timerState,
        id: this.id
      })

      this.rafId = this.raf.call(window, () => this.timerRun());

      return timerState;
    });
  }

  /**
   * Pauses a timer
   *
   * @memberof TimeCard
   */
  pauseTimer() {
    this.setState((state, props) => {
      let timerState = {
        ...state,
        timerRunning: false
      };

      props.onTimerStop({
        timerState,
        id: this.id
      });

      return timerState;
    });

  }

  /**
   * Resets a timer to its initial state. Preserves creation timestamp.
   *
   * @memberof TimeCard
   */
  resetTimer() {
    if (window.confirm('Are you sure you want to RESET this timer?')) {
      let state = this.props.getStateById(this.id);
      cancelAnimationFrame(state.rafId);
      let newState = {
        ...this.initTimerState,
        timerStartDate: new Date(),
      }
      this.props.onTimerUpdate({
        timerState: newState,
        id: this.id,
        stopTimer: state.timerRunning
          ? true
          : false,
      });
      this.setState((state, props) => newState);
    }
  }

  /**
   * Deletes a timer.
   *
   * @memberof TimeCard
   */
  removeTimer() {
    if (window.confirm('Are you sure you want to REMOVE this timer?')) {
      this.props.onTimerDelete({
        id: this.id,
        timerState: this.props.getAllTimerStates[this.id],
      });
    }
  }

  /**
   * Converts a timestamp to a human readable format
   *
   * @returns {string} Human readable timer string
   * @memberof TimeCard
   */
  formatTimerDate() {
    let dateOpt = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    let date = new Date(this.state.timerStartDate);

    return date.toLocaleTimeString('en-US', dateOpt);
  }

  /**
   * Creates a human readable time string when provided time
   *
   * @param {number} [milliseconds=0] Timestamp in milliseconds
   * @returns {string} Formatted time in hour, minutes and seconds
   * @memberof TimeCard
   */
  formatTime(milliseconds) {
    let time = milliseconds / 1000;
    const converter
      = (denom = 1) => ((time / denom) % 60 < 10 || (time / denom) % 60 === 60)
        ? `0${Math.floor(time / denom) % 60}`
        : `${Math.floor(time / denom) % 60}`;

    let sec = converter(1);
    let min = converter(60);
    let hr = converter(3600);

    return `${hr}:${min}:${sec}`;
  }

  /**
   * Builds component that provides timer editing functionality
   *
   * @returns {ReactElement} TimeCardEdit component
   * @memberof TimeCard
   */
  editForm() {
    return React.createElement(
      TimeCardEdit, {
      ...this.props,
      id: this.id,
      title: this.state.title,
      description: this.state.description,
      handleEditFormUpdate: this.handleEditFormUpdate,
      timeProgress: this.state.timeProgress,
      timerRunning: this.state.timerRunning,
    });
  }

  /**
   * Callback for updating timer state. Passed to the TimerCardEdit component via props
   *
   * @param {Object} formState Updated timer state passed from edit form
   * @memberof TimeCard
   */
  handleEditFormUpdate(formState) {
    this.setState((state, props) => {
      let timerState = {
        ...this.state,
        ...formState
      }

      this.props.onTimerUpdate({
        timerState,
        id: this.id
      });

      return timerState;
    });
  }


  openFormModal() {
    window.M.Modal.init(this.modalRef.current, {});
  }

  /**
   * Handler for ondrop event for a timer. Used when dropping tags onto a timer.
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCard
   */
  handleTagOnDrop(e) {
    e.stopPropagation();
    let payload = JSON.parse(e.dataTransfer.getData('application/json') || '{}');

    if (Object.keys(payload).length > 0 && payload.type === 'TAG_LINK') {
      this.setState((state) => {
        let tags = {
          ...state.tags,
          [payload.id]: payload
        }

        let newState = {
          ...state,
          tags
        }

        this.props.onTimerUpdate({
          timerState: newState,
          id: this.id,
        });
        return newState;
      })
    }
  }

  /**
   * Handler for ondragover event for a timer. Used when dropping tags onto a timer.
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCard
   */
  handleTagOnDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy"
  }

  /**
   * Handler for ondragleave event for a timer. Used when dropping tags onto a timer.
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCard
   */
  handleTagOnDragLeave(e) {
    e.preventDefault();
  }

  /**
   * Handler for onclick event used when removing tags from a timer
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCard
   */
  handleTagRemove(e) {
    e.preventDefault();
    let id = e.target.id.replace('tag-remove-', '');

    this.setState((state, props) => {
      delete state.tags[id];

      this.props.onTimerUpdate({
        timerState: state,
        id: this.id,
      });
      return state;
    });

  }

  /**
   * Builds a list of tags associated with the timer
   *
   * @returns {array} List of tag elements in JSX format
   * @memberof TimeCard
   */
  buildTagList() {
    return Object.entries(this.props.getAllTagsById).map(([id, tagState]) => {
      return (this.state.tags[id])
      ? (
        <div
          style={{
            textTransform: 'capitalize'
          }}
          className={this.cardClass(['chip'], ['white'], ['grey', 'lighten-2'])}
          id={'tag-chip-' + id}
          key={id}>
          {tagState.name}
          <i id={'tag-remove-' + id}
            className="material-icons"
            style={{
              cursor: 'pointer',
              float: 'right',
              fontSize: '16px',
              lineHeight: '32px',
              paddingLeft: '8px',
            }}
            onClick={this.handleTagRemove}>close</i>
        </div>
      )
      : null
    })
  }

  /**
   * Generates background color styling classes based on timer states.
   *
   * @param {array} [additionalClasses=['']] An array containing list of classes to include
   * @param {array} [runningClasses=null] An array containing list of classes to include when timer is running
   * @param {array} [stoppedClasses=null] An array containing list of classes to include when timer is stopped
   * @returns {string} String literals containing classes to add to an element
   * @memberof TimeCard
   */
  cardClass(additionalClasses = [''], runningClasses = null, stoppedClasses = null) {
    const RUNNING = runningClasses || ['light-blue', 'lighten-1'];
    const STOPPED = stoppedClasses || ['white'];

    let classNames = [
      ...additionalClasses,
    ];

    classNames = (this.state.timerRunning)
      ? [...classNames, ...RUNNING]
      : [...classNames, ...STOPPED];

    return classNames.join(' ');
  }

  /**
   * Generates text color styling classes based on timer states.
   *
   * @param {array} [additionalClasses=['']] An array containing list of classes to include
   * @param {array} [runningClasses=null] An array containing list of classes to include when timer is running
   * @param {array} [stoppedClasses=null] An array containing list of classes to include when timer is stopped
   * @returns {string} String literals containing classes to add to an element
   * @memberof TimeCard
   */
  cardTextClass(additionalClasses = [''], runningClasses = null, stoppedClasses = null) {
    const RUNNING = runningClasses || ['white'];
    const STOPPED = stoppedClasses || ['grey', 'darken-1'];

    let classNames = [
      ...additionalClasses,
    ];

    const textModifier = (color) => {
      return (color.indexOf('darken') === 0 || color.indexOf('lighten') === 0)
        ? `text-${color}`
        : `${color}-text `;
    }

    classNames = (this.state.timerRunning)
      ? [...classNames, ...RUNNING.map(color => textModifier(color))]
      : [...classNames, ...STOPPED.map(color => textModifier(color))];

    return classNames.join(' ');
  }

  /**
   * @todo Refactor into smaller components
   * @memberof TimeCard
   */
  render() {
    return (
      <section
        ref={this.timerRef}
        onDragOver={this.handleTagOnDragOver}
        onDragLeave={this.handleTagOnDragLeave}
        onDrop={this.handleTagOnDrop}
        className="timer-card-wrapper row">
        <div className="side-button-wrapper">
          <div
            id={'drag-' + this.props.id}
            draggable={true}
            onDrag={this.props.handleOrderOnDrag}
            onDragStart={this.props.handleOrderOnDragStart}
            onDragEnd={this.props.handleOrderOnDragEnd}
            className={"side-button drag-handle btn-flat grey-text text-darken-2 " + ((this.props.timerSearchQuery || this.props.getFilteredCategories.length > 0) ? 'disabled' : '')}>
            <i className="material-icons">drag_handle</i>
          </div>
          <button
            onClick={this.removeTimer}
            className="side-button btn-flat grey-text text-darken-2">
            <i className="material-icons">delete_forever</i></button>
          <button
            className="side-button btn-flat grey-text text-darken-2 modal-trigger"
            data-target={'modal-' + this.id} >
            <i className="material-icons">edit</i></button>
          <button
            onClick={this.resetTimer}
            className="side-button btn-flat grey-text text-darken-2">
            <i className="material-icons">refresh</i></button>
        </div>
        <div
          id={this.props.id}
          className={this.cardClass(['card', 'z-depth-0', 'left', 'timer-card'])}>
          <div className={this.cardTextClass(["card-content"], ['grey', 'darken-3']) + this.cardClass([''], ['light-blue', 'lighten-4'])}>
            <span className="card-title">
              <span>{this.state.title || this.id}</span>
              <div>
                <small>
                  {this.formatTimerDate()}
                </small>
              </div>
            </span>
            <blockquote className="card-description">
              {this.state.description
                ? this.state.description.split('\n').map((string, idx) => <p key={idx}>{string}</p>)
                : ''}
            </blockquote>
            <div className="card-meta">
                {this.buildTagList()}
            </div>
          </div>
          <div className="card-action">
            <Timer
              additionalStyle={{ float: 'right' }}
              time={this.state.timeProgress}
              running={this.state.timerRunning} />
            <button disabled={this.state.timerRunning} onClick={this.startTimer} className={this.cardTextClass(["btn-flat"])}>
              <i className="material-icons">play_arrow</i></button>
            <button disabled={!this.state.timerRunning} onClick={this.pauseTimer} className={this.cardTextClass(["btn-flat"])}>
              <i className="material-icons">pause</i></button>
          </div>
        </div>
        <div id={'modal-' + this.id} ref={this.modalRef} className="modal">
          <div className="modal-content">
            <div className="row">
              <div className="col s12">
                <h5>Edit Timer</h5>
              </div>
            </div>
            {this.editForm()}
          </div>
          <div className="modal-footer">
            <div className="left center-align">
              <Timer
                time={this.state.timeProgress}
                running={this.state.timerRunning}
                caption={this.state.timerRunning ? '- Running' : '- Stopped'}/>

              <div className="controls-edit-modal"
                style={{
                  padding: '0 .5rem',
                  display: 'inline-block',
                }}>
                <button
                  style={{
                    height: '2rem',
                    lineHeight: '2rem',
                    display: (this.state.timerRunning)
                      ? 'none'
                      : 'inline-block',
                  }}
                  disabled={this.state.timerRunning}
                  onClick={this.startTimer}
                  className={this.cardTextClass(["btn-flat"],['grey'],['grey'])}>
                  <i className="material-icons">play_arrow</i></button>
                <button
                  style={{
                    height: '2rem',
                    lineHeight: '2rem',
                    display: (!this.state.timerRunning)
                      ? 'none'
                      : 'inline-block',
                  }}
                  disabled={!this.state.timerRunning}
                  onClick={this.pauseTimer}
                  className={this.cardTextClass(["btn-flat"],['grey'],['grey'])}>
                  <i className="material-icons">pause</i></button>
              </div>
            </div>
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Done</a>
          </div>
        </div>
      </section>
    )
  }
};
