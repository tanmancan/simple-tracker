import React, { Component } from 'react';
import TimeCard from './TimeCard';
import dragImg from '../assets/drag.png';

const e = React.createElement;

export default class TimeCardListBuilder extends Component {
  constructor(props) {
    super(props);
    this.sortByWeight = this.sortByWeight.bind(this);
    this.timeCardBuilder = this.timeCardBuilder.bind(this);
    this.handleOrderOnDrag = this.handleOrderOnDrag.bind(this);
    this.handleOrderOnDragStart = this.handleOrderOnDragStart.bind(this);
    this.handleOrderOnDragEnd = this.handleOrderOnDragEnd.bind(this);
    this.handleOrderOnDragOver = this.handleOrderOnDragOver.bind(this);
    this.handleOrderOnDragLeave = this.handleOrderOnDragLeave.bind(this);
    this.handleOrderOnDrop = this.handleOrderOnDrop.bind(this);

    this.dragImg = new Image();
  }

  componentDidMount() {
    this.dragImg.src = dragImg;
  }


  sortByWeight() {
    return this;
  }

  dragDividerStyle() {
    return {
      width: '100%',
      height: '1rem'
    }
  }

  handleOrderOnDrag(e) {
    e.target.parentNode.parentNode.style.opacity = '.5';
  }

  handleOrderOnDragStart(e) {
    e.target.classList.add('dragging');
    let payload = {
      id: e.target.id.replace('drag-', '')
    }
    e.dataTransfer.setDragImage(this.dragImg, 25, 25);
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
  }

  handleOrderOnDragEnd(e) {
    e.target.classList.remove('dragging');
    e.target.parentNode.parentNode.style.opacity = '1';
  }

  handleOrderOnDragOver(e) {
    e.preventDefault();
    e.target.classList.add('red');
  }

  handleOrderOnDragLeave(e) {
    e.preventDefault();
    e.target.classList.remove('red');
  }

  handleOrderOnDrop(e) {
    e.target.classList.remove('red');
    let payload = JSON.parse(e.dataTransfer.getData('application/json'));
    let position = e.target.id.replace('card-divider-', '');

    this.props.onTimerUpdateOrder({
      targetPos: position,
      id: payload.id
    })
  }

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
            onDrop: this.handleOrderOnDrop
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
            onDrop: this.handleOrderOnDrop
          }, null)
          : null
      )
    );
  }

  render() {
    return (
      <div className="timers">
        <div className="timer-list">

          {(this.props.getAllTimers.length > 0)
            ? this.props.getAllTimers.map(
              (id, idx) => this.timeCardBuilder(id, idx, this.props.getAllTimers.length)
            )
            : <div className="col s12">
              <div className="card white">
                <div className="card-content grey-text text-darken-3">
                  <span className="card-title">No timers found</span>
                </div>
                <div className="card-action">
                  <a href="#add-timer" className="waves-effect waves-light btn blue white-text" onClick={this.props.onTimerAdd}>Add a new timer</a>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
