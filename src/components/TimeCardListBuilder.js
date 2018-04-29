import React, { Component } from 'react';
import TimeCard from './TimeCard';
import dragImg from '../assets/drag.png';

const e = React.createElement;
/**
 * Component that creates a list of timers
 *
 * @export
 * @class TimeCardListBuilder
 * @extends {Component}
 */

export default class TimeCardListBuilder extends Component {
  constructor(props) {
    super(props);
    this.timeCardBuilder = this.timeCardBuilder.bind(this);
    this.handleOrderOnDrag = this.handleOrderOnDrag.bind(this);
    this.handleOrderOnDragStart = this.handleOrderOnDragStart.bind(this);
    this.handleOrderOnDragEnd = this.handleOrderOnDragEnd.bind(this);
    this.handleOrderOnDragOver = this.handleOrderOnDragOver.bind(this);
    this.handleOrderOnDragLeave = this.handleOrderOnDragLeave.bind(this);
    this.handleOrderOnDrop = this.handleOrderOnDrop.bind(this);
    this.handleSearchFilter = this.handleSearchFilter.bind(this);

    this.dragImg = new Image();
  }

  componentDidMount() {
    this.dragImg.src = dragImg;
  }

  /**
   * Handler for a timer's ondrag event
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCardListBuilder
   */
  handleOrderOnDrag(e) {
    e.target.parentNode.parentNode.style.opacity = '.5';
  }

  /**
   * Handler for a timer's ondragstart event
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCardListBuilder
   */
  handleOrderOnDragStart(e) {
    let payload = {
      id: e.target.id.replace('drag-', ''),
      type: 'TIMER_ORDER'
    }

    e.target.classList.add('dragging');

    // Edge does not support this as of April 2018
    // https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer/suggestions/6542268-setdragimage-on-datatransfer-of-dragevent
    try {
      e.dataTransfer.setDragImage(this.dragImg, 25, 25);
    } catch(err) {
      console.warn(err);
    }

    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";

    this.props.onTimerDrag({
      dragState: true,
      id: payload.id
    });
  }

  /**
   * Handler for a timer's ondragend event
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCardListBuilder
   */
  handleOrderOnDragEnd(e) {
    e.target.classList.remove('dragging');
    e.target.parentNode.parentNode.style.opacity = '1';

    this.props.onTimerDrag({
      dragState: false,
      id: e.target.id.replace('drag-', '')
    });
  }

  /**
   * Handler for a ondragover event
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCardListBuilder
   */
  handleOrderOnDragOver(e) {
    e.preventDefault();
    e.target.classList.add('red');
    e.dataTransfer.dropEffect = "move"
  }

  /**
   * Handler for a ondragleave event
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCardListBuilder
   */
  handleOrderOnDragLeave(e) {
    e.preventDefault();
    e.target.classList.remove('red');
  }

  /**
   * Handler for a ondrop event
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TimeCardListBuilder
   */
  handleOrderOnDrop(e) {
    e.preventDefault();
    e.target.classList.remove('red');
    let payload = JSON.parse(e.dataTransfer.getData('application/json') || '{}');
    if (Object.keys(payload).length > 0 && payload.type === 'TIMER_ORDER') {
      let position = e.target.id.replace('card-divider-', '');

      this.props.onTimerUpdateOrder({
        targetPos: position,
        id: payload.id
      })
    }
  }

  /**
   * Callback function that filters the list of timer's being shown based on search query
   *
   * @param {any} id An id for a timer
   * @returns {bool}
   * @memberof TimeCardListBuilder
   */
  handleSearchFilter(id) {
    let q = this.props.timerSearchQuery.toLowerCase();
    let timer = this.props.getAllTimerStates[id];
    let tags = timer.tags;

    if (!q) {
      let catCheck = Object.values(tags).filter(tag => this.hiddenTagCategory(tag.tagState)).length === 0;

      return catCheck;
    }

    const strQuery = (searchString) => {
      return searchString.toLowerCase().indexOf(q) !== -1;
    }

    let titleCheck = strQuery(timer.title);

    let descCheck = strQuery(timer.description);

    let dateOpt = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    let startDate = new Date(timer.timerStartDate).toLocaleTimeString('en-US', dateOpt);

    let startDateCheck = strQuery(startDate);

    let tagCheck = Object.values(tags).filter(tag => strQuery(tag.tagState.name)).length > 0;

    let catCheck = Object.values(tags).filter(tag => this.hiddenTagCategory(tag.tagState)).length === 0;

    return (titleCheck || descCheck || startDateCheck || tagCheck) && catCheck;
  }

  /**
   * Checks to see if provided tag's category is part of the do not show category list
   * @param {string:string} tagState Object containing tag name and category
   * @return {bool} True if current tag category is set to be hidden
   * @memberof TimeCardListBuilder
   */
  hiddenTagCategory(tagState) {
    let dontShowCategories = this.props.getFilteredCategories;

    return dontShowCategories.indexOf(tagState.category) !== -1;
  }

  /**
   * @todo Refactor how inline styles are managed
   * @memberof TimeCardListBuilder
   */
  dragDividerStyle() {
    return {
      height: '1rem',
      margin: '0 .75rem',
      border: (this.props.getDragState)
        ? '2px dashed #f44236'
        : 'none',
      background: (this.props.getDragState)
        ? '#f442361e'
        : 'none'
    }
  }

  /**
   * Callback functions that creates the timer list
   *
   * @param {string} id The id of the current timer element
   * @param {number} idx Current index of the timer list
   * @param {number} len Length of the timer list
   * @returns {ReactElement}
   * @memberof TimeCardListBuilder
   */
  timeCardBuilder(id, idx, len) {
    return (
      e('div', { id: `card-wrapper-${id}`, key: `card-wrapper-${id}` },
        e('div', {
            className: 'drag-divider',
            id: `card-divider-${idx}`,
            key: `card-divider-${idx}`,
            style: this.dragDividerStyle(),
            onDragOver: this.handleOrderOnDragOver,
            onDragLeave: this.handleOrderOnDragLeave,
            onDrop: this.handleOrderOnDrop,
          }, null
        ),
        e(
          TimeCard, {
            ...this.props,
            id,
            key: id,
            weight: idx,
            appModal: this.props.appModal,
            handleOrderOnDrag: this.handleOrderOnDrag,
            handleOrderOnDragStart: this.handleOrderOnDragStart,
            handleOrderOnDragEnd: this.handleOrderOnDragEnd,
            timerSearchQuery: this.props.timerSearchQuery,
          }, null
        ),
        (idx === len -1)
          ? e('div', {
            className: 'drag-divider',
            id: `card-divider-${idx+1}`,
            key: `card-divider-${idx+1}`,
            style: this.dragDividerStyle(),
            onDragOver: this.handleOrderOnDragOver,
            onDragLeave: this.handleOrderOnDragLeave,
            onDrop: this.handleOrderOnDrop,
          }, null)
          : null
      )
    );
  }

  /**
   * Displays a message if the timer list is empty
   *
   * @returns {ReactElement} JSX markup for the display message
   * @memberof TimeCardListBuilder
   */
  noTimerMsg() {
    return(
      <div className="col s12">
        <div className="card white z-depth-0">
          <div className="card-content grey-text text-darken-3">
            <span className="card-title">No timers found</span>
          </div>
          <div className="card-action">
            Click the blue <a className="btn-floating grey disabled z-depth-0"><i className="material-icons">add</i></a> button on the bottom right of the screen to add a new timer.
                </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="timers">
        <div className="timer-list">

          {(this.props.getAllTimers.length > 0)
            ? this.props.getAllTimers
              .filter(this.handleSearchFilter)
              .map(
                (id, idx) => this.timeCardBuilder(id, idx, this.props.getAllTimers.length)
              )
            : this.noTimerMsg()}
        </div>
      </div>
    );
  }
}
