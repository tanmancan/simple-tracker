import React, { Component } from 'react';
import {rand} from '../utilities/rand';

export default class TagUi extends Component {
  constructor(props) {
    super(props);
    this.tagListRef = React.createRef();
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleTagOnChange = this.handleTagOnChange.bind(this);
    this.handleTagEdit = this.handleTagEdit.bind(this);
    this.handleTagEditDone = this.handleTagEditDone.bind(this);
    this.handleTagDeletion = this.handleTagDeletion.bind(this);
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
    let deleteIcon = input.nextSibling;
    input.classList.remove('hide');
    deleteIcon.classList.remove('hide');
    input.style.display = 'inline';
    input.focus();
    input.setSelectionRange(0, -1);
    name.classList.add('hide');
  }

  handleTagEditDone(e) {
    e.target.previousSibling.classList.remove('hide');
    e.target.nextSibling.classList.add('hide');
    e.target.classList.add('hide');
  }

  handleTagDeletion(id, cat, e) {
    this.props.onTagDelete(id);
    this.setState({
      currentCategory: cat
    });
  }

  handleTagOnDrag(e) {

  }

  handleTagOnDragStart(e) {
    let id = e.target.id.replace('tag-drag-id-', '').replace('all-tags-','');
    let payload = {
      id,
      tagState: this.props.getAllTagsById[id],
      type: 'TAG_LINK'
    }
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
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
                      style={{
                        cursor: 'pointer',}}
                      onClick={(e) => this.handleAddTag(id, e)}>
                      Add
                      <i className="material-icons"
                        style={
                          {
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
          onDrag={this.handleTagOnDrag}
          onDragStart={this.handleTagOnDragStart}
          onDragEnd={this.handleTagOnDragEnd}
          id={'tag-drag-id-' + id}
          key={'tag-drag-' + idx}
          className="chip">
        <span
          onClick={this.handleTagEdit}>{this.props.getAllTagsById[id].name}</span>
        <input
          id={'tag-chip-edit-' + id}
          style={{ width:'calc(100% - 35px)', height: 'auto' }}
          className="hide"
          onBlur={this.handleTagEditDone}
          onChange={this.handleTagOnChange}
          type="text"
          value={this.props.getAllTagsById[id].name} />
        <i className="material-icons hide"
          // @TODO: see if there is a better way to implement onBlur functionality so we don't have to
          // rely on onMouseDown for event ordering. Currently onMouseDown will trigger before onBlur letting
          // us delete a tag before it gets hidden by the onblur event callback
          onMouseDown={(e) => this.handleTagDeletion(id, catId, e)}
          style={
            {
              float: 'right',
              fontSize: '16px',
              lineHeight: '32px',
              paddingLeft: '8px',
            }
          }>delete</i>
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
                    onDrag={this.handleTagOnDrag}
                    onDragStart={this.handleTagOnDragStart}
                    onDragEnd={this.handleTagOnDragEnd}
                    id={'all-tags-tag-drag-id-' + id}
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
                    <i className="material-icons hide"
                      // @TODO: see if there is a better way to implement onBlur functionality so we don't have to
                      // rely on onMouseDown for event ordering. Currently onMouseDown will trigger before onBlur letting
                      // us delete a tag before it gets hidden by the onblur event callback
                      onMouseDown={(e) => this.handleTagDeletion(id, this.props.getAllTagsById[id].category, e)}
                      style={
                        {
                          float: 'right',
                          fontSize: '16px',
                          lineHeight: '32px',
                          paddingLeft: '8px',
                        }
                      }>delete</i>
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
            Click on a tag to edit its name. To tag a timer, drag and drop a tag onto that timer.
            To rename or delete categories, click Manage Tags/Category menu item.
                  </a>
          </li>
        </ul>
      </li>
    );
  }
}
