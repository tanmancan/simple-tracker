import React, { Component } from 'react';

export default class Guide extends Component {
  render() {
    const usageGuideStyle = {
      margin: '1rem .75rem',
      padding: '1rem 2rem',
    };

    return(
      <div
        style={usageGuideStyle}
        className="usage-guide white">
        <a
          href="#!"
          onClick={(e) => {this.props.handleUsageGuide('CLOSE')}}
          className="btn-flat right"><i className="material-icons">close</i></a>
        <div className="section">
          <h5>Using the Timer</h5>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Adding and Using a Timer</h6>
          <p>Add a timer by either using the <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons left">add_alarm</i>Add Timer</button> from the side-nav or the <button className="btn-small btn-floating grey lighten-1 z-depth-0"><i className="material-icons">add</i></button> button in the bottom right corner of the screen.</p>
          <p>You can start or pause a timer by using the <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons">play_arrow</i></button> or <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons">pause</i></button> button.</p>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Editing a Timer</h6>
          <img className="responsive-img" src="/images/timer-edit-modal.jpg" alt="Editing a timer" />
          <p>
            Edit a timer's name and description by clicking on the <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons">edit</i></button> button to the left of the timer.
          </p>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Resetting a Timer</h6>
          <p>Reset a timer by clicking on the <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons">refresh</i></button> button to the left of the timer. This action is irreversible</p>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Deleting a Timer</h6>
          <p>Use the <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons">delete</i></button> button on the left of the timer to delete a timer.</p>
          <div id="toast-container"
          style={{
            position: 'relative',
            display: 'inline-block',
            width: 'auto',
            top: '0',
            right: 'auto',
            zIndex: 0,
            }}>
            <div
            style={{
              top: '0',
            }}
            className="toast">
            Timer Deleted &nbsp; <a href="#undo" className="orange-text">Undo</a>
          </div></div>
          <p>If you accidentally deleted a timer, click the undo link within the Timer Deleted message to restore that timer. The timer cannot be re-added, once the message is dismissed.</p>
          <p>Timers can also be deleted by dragging and dropping it on the <button className="btn-small btn-floating grey lighten-1 z-depth-0"><i className="material-icons">delete</i></button> button in the bottom right corner of the screen.</p>
        </div>
        <div className="divider"></div>
        <div className="section">
            <h6>Reorder a Timer List</h6>
            <img className="responsive-img" src="/images/timer-drag-order.jpg" alt="Drag and drop reorder"/>
          <p>To reorder a timer, click and drag the <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons">drag_handle</i></button> drag handle and drop it on the desired position within the timer list.</p>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h5>Using Tags and Categories</h5>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Adding Tags to Timers</h6>
          <img className="responsive-img" src="/images/tag-add-timer.jpg" alt="Add tag to timer"/>
          <p>You can add tags to a timer to help filter them by specific keywords. Tags can also be grouped by categories to help filter timers by specific tag categories.</p>
          <p>Add a tag to a timer by clicking and dragging a tag chip <span className="chip">Example Tag</span> from the side-nav and dropping it on a timer. Remove a tag from a timer, by clicking the close icon <span className="chip">Example Tag <i className="material-icons"
            style={{
              cursor: 'pointer',
              float: 'right',
              fontSize: '16px',
              lineHeight: '32px',
              paddingLeft: '8px',
            }}>close</i></span> next to a tag.</p>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Editing Tags and Categories</h6>
          <p>Use the <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons left">settings</i>Edit Tags/Category</button> button from the side-nav to open the Edit Tags and Categories panel. From here you can add, remove, or rename tags and categories.</p>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Renaming Categories</h6>
          <img className="responsive-img" src="/images/rename.png" alt="Rename a Category"/>
          <p>Categories can only be renamed form with in the Edit panel. Rename a category by clicking directly on its name label, and typing in a new name. Exit the edit mode by clicking anywhere else in the screen.</p>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Adding and Deleting Categories</h6>
          <p>Categories can only be added or deleted from the Edit Tags and Category panel.</p>
          <p>Add a category by using the
        <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons left">add</i>Add Category</button> button.</p>
          <p>Remove a category by using the
                  <button
              style={{ padding: '0 .25rem' }}
              className="btn-flat disabled grey">
              <i className="material-icons">delete</i>
            </button> button.</p>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Renaming Tags</h6>
          <img src="/images/rename-sidebar.jpg" alt="Rename tag from sidebar"/>
          <p>Tags can either be renamed from the side-nav, or the Edit Tags and Categories panel. Rename a tag by clicking directly on its name label and type in a new name. Exit the edit mode by clicking anywhere else on the screen.</p>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h6>Adding and Deleting Tags</h6>
          <p>Tags can be added or deleted from the side-nav or the Edit Tags and Categories panel.</p>
          <p>Add a tag from the side-nav by clicking the <span className="chip">Add</span> button. A newly created tag will have a randomly generated name.</p>
          <p>To add a tag from inside the Edit Tags and Categories panel, click the
                  <button
              style={{ padding: '0 .25rem' }}
              className="btn-flat disabled grey">
              <i className="material-icons">local_offer</i>
            </button> button next to a category to view tags associated with that category.
            Add a tag by using the <button className="btn-small btn z-depth-0 grey lighten-1"><i className="material-icons left">add</i>Add Category</button> button.</p>
            <p>Delete a tag by using the
                  <button
              style={{ padding: '0 .25rem' }}
              className="btn-flat disabled grey">
              <i className="material-icons">delete</i>
            </button> button.</p>
          <p>Delete a tag from the side-nav by clicking the tag name label to go into edit mode. While within the edit mode, click the <button
            style={{ padding: '0 .25rem' }}
            className="btn-flat disabled grey">
            <i className="material-icons">delete</i>
          </button> button to remove that tag.</p>
        </div>
      </div>
    )
  }
}
