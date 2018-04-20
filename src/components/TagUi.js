import React, { Component } from 'react';
import rand from 'random-words';

export default class TagUi extends Component {
  constructor(props) {
    super(props);
    this.tagListRef = React.createRef();
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleTagOnChange = this.handleTagOnChange.bind(this);
    this.handleTagEdit = this.handleTagEdit.bind(this);
    this.handleTagEditDone = this.handleTagEditDone.bind(this);
    this.handleTagOnDrag = this.handleTagOnDrag.bind(this);
    this.handleTagOnDragStart = this.handleTagOnDragStart.bind(this);
    this.handleTagOnDragEnd = this.handleTagOnDragEnd.bind(this);
    this.state = {};
  }

  componentDidUpdate(props, state) {
    let context = this.tagListRef.current;
    if (context !== null) {
      window.M.AutoInit(context);
    }
  }

  handleAddTag(cat) {
    this.props.onTagAdd({
      name: rand(),
      category: cat
    });
  }

  handleAddCategory() {
    this.props.onCategoryAdd({
      name: rand(),
      id: rand()
    });
  }

  handleTagOnChange(e) {
    let name = e.target.value;
    let id = e.target.id.replace('tag-chip-edit-', '');
    let tagState = {
      ...this.props.getAllTagsById[id],
      name
    }
    this.setState((state, props) => {
      props.onTagUpdate({
        tagState,
        id
      });
      return state;
    });
  }

  handleTagEdit(e) {
    let name = e.target;
    let input = name.nextSibling;
    input.classList.remove('hide');
    input.style.display = 'inline';
    input.focus();
    input.setSelectionRange(0, -1);
    name.classList.add('hide');
  }

  handleTagEditDone(e) {
    e.target.previousSibling.classList.remove('hide');
    e.target.classList.add('hide');
  }

  handleTagOnDrag(e) {

  }

  handleTagOnDragStart(e) {
    let id = e.target.id.replace('tag-drag-id-', '');
    let payload = {
      id,
      tagState: this.props.getAllTagsById[id],
      type: 'TAG_LINK'
    }
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
  }

  handleTagOnDragEnd(e) {

  }

  buildCategoryList() {
    if (this.props.getAllCategories.length > 0) {
      return this.props.getAllCategories.map((id, idx) => {
        return (
          <ul id={'cat-list-' + id} key={'cat-list-' + idx} className="collapsible collapsible-accordion">
            <li className="active" style={{ textTransform: 'capitalize' }}>
              <a className="collapsible-header active">
                {(this.props.getAllCategoriesById[id])
                  ? this.props.getAllCategoriesById[id].name
                  : ''
                } Tags
              <i className="material-icons">arrow_drop_down</i></a>
              <div className="collapsible-body">
                <ul>
                  <li style={{ textTransform: 'capitalize', padding: '0 1rem' }}>
                    {this.buildTagList(id)}
                    <div className="chip"
                      onClick={(e) => this.handleAddTag(id, e)}>
                      Add
                      <i className="material-icons"
                        style={
                          {
                            cursor: 'pointer',
                            float: 'right',
                            fontSize: '16px',
                            lineHeight: '32px',
                            paddingLeft: '8px',
                          }
                        }>add</i>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        )
      });
    }
  }

  buildTagList(catId) {
    return (this.props.getAllCategoriesById[catId].tags).map(
      (id, idx) => <div
          style={{ cursor: 'pointer', transform: 'translate(0, 0)'}}
          draggable="true"
          onDrag={this.handleTagOnDragStart}
          onDragStart={this.handleTagOnDragStart}
          onDragEnd={this.handleTagOnDragEnd}
          id={'tag-drag-id-' + id}
          key={'tag-drag-' + idx}
          className="chip">
        <span
          onClick={this.handleTagEdit}>{this.props.getAllTagsById[id].name}</span>
        <input
          id={'tag-chip-edit-' + id}
          style={{ width: 'calc(100% - 35px)', height: 'auto' }}
          className="hide"
          onBlur={this.handleTagEditDone}
          onChange={this.handleTagOnChange}
          type="text"
          value={this.props.getAllTagsById[id].name} />
        </div>
      );
  }

  helpTextStyle() {
    return {
      lineHeight: '1.6',
      padding: '1rem 2rem',
      height: 'auto',
      borderTop: '1px solid whitesmoke',
    }
  }

  render() {
    return(
      <li className="no-padding" ref={this.tagListRef}>
        {this.buildCategoryList()}
        <ul className="collapsible collapsible-accordion">
          <li className="active">
            <a className="collapsible-header"><i className="material-icons">local_offer</i>All Tags</a>
            <div className="collapsible-body">
              <ul>
                <li style={{ textTransform: 'capitalize', padding: '0 1rem' }}>
                {(this.props.getAllTags).map(
                  (id, idx) => <div
                    style={{ cursor: 'pointer', transform: 'translate(0, 0)', }}
                    draggable="true"
                    onDrag={this.handleTagOnDragStart}
                    onDragStart={this.handleTagOnDragStart}
                    onDragEnd={this.handleTagOnDragEnd}
                    id={'tag-drag-id-' + id}
                    key={'tag-drag-' + idx}
                    className="chip">
                    <span
                      onClick={this.handleTagEdit}>{this.props.getAllTagsById[id].name}</span>
                    <input
                      id={'tag-chip-edit-' + id}
                      style={{ width: 'calc(100% - 35px)', height: 'auto' }}
                      className="hide"
                      onBlur={this.handleTagEditDone}
                      onChange={this.handleTagOnChange}
                      type="text"
                      value={this.props.getAllTagsById[id].name} />
                  </div>
                )}
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <ul>
          <li>
            <a style={this.helpTextStyle()}>
            Click Manage Tags/Category to add and edit tags and categories.
              To add a tag to a timer, drag and drop the tag on to the timer.
                  </a>
          </li>
        </ul>
      </li>
    );
  }
}
