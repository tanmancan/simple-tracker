import React, { Component } from 'react';
import {rand} from '../utilities/rand';
import '../styles/TagEditor.scss';

/**
 * Component for editing tags and categories
 *
 * @export
 * @class TagEditor
 * @extends {Component}
 */
export default class TagEditor extends Component {
  constructor(props) {
    super(props);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleCategoryOnChange = this.handleCategoryOnChange.bind(this);
    this.handleCategoryEdit = this.handleCategoryEdit.bind(this);
    this.handleCategoryEditDone = this.handleCategoryEditDone.bind(this);
    this.handleCategorySelection = this.handleCategorySelection.bind(this);
    this.handleCategoryDeletion = this.handleCategoryDeletion.bind(this);
    this.handleTagOnChange = this.handleTagOnChange.bind(this);
    this.handleTagEdit = this.handleTagEdit.bind(this);
    this.handleTagEditDone = this.handleTagEditDone.bind(this);
    this.handleTagDeletion = this.handleTagDeletion.bind(this);
    this.state = {
      currentCategory: null,
    }
  }

  /**
   * Handler for add tag button click
   *
   * @param {string} cat Category ID to associate the tag to
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TagEditor
   */
  handleAddTag(cat, e) {
    this.props.onTagAdd({
      name: rand(),
      category: cat
    });
  }

  /**
   * Handler for add category button click
   *
   * @memberof TagEditor
   */
  handleAddCategory() {
    this.props.onCategoryAdd({
      name: rand(),
      id: rand()
    });
  }

  /**
   * Handler for category edit field onchange event
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TagEditor
   */
  handleCategoryOnChange(e) {
    e.stopPropagation();
    let name = e.target.value
    let id = e.target.id.replace('category-edit-', '');
    let categoryState = {
      ...this.props.getAllCategoriesById[id],
      name
    }
    this.setState((state, props) => {
      props.onCategoryUpdate({
        categoryState,
        id
      });
      return state;
    });
  }

  /**
   * Handler for edit category click event
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TagEditor
   */
  handleCategoryEdit(e) {
    e.stopPropagation();
    let name = e.target;
    let input = name.nextSibling;
    name.classList.add('hide');
    input.classList.remove('hide');
    input.style.display = 'inline';
    if (input.id.replace('category-edit-', '') === this.state.currentCategory) {
      input.style.borderBottom = '1px solid white';
      input.style.boxShadow = '0 1px 0 0 white';
    } else {
      input.style.borderBottom = '1px solid #03a9f4';
      input.style.boxShadow = '0 1px 0 0 #03a9f4';
    }
    input.focus();
    input.setSelectionRange(0, -1);
  }

  /**
   * Handler for edit category field onblur event. Used to hide edit field when clicked elsewhere in the screen.
   *
   * @param {any} e
   * @memberof TagEditor
   */
  handleCategoryEditDone(e) {
    e.target.previousSibling.classList.remove('hide');
    e.target.classList.add('hide');
  }

  /**
   * Handler for select category button click
   *
   * @param {string} cat Category ID
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TagEditor
   */
  handleCategorySelection(cat, e) {
    this.setState((state, props) => {
      return {
        currentCategory: cat
      }
    })
  }

  /**
   * Handler for delete category button click
   *
   * @param {string} id Id of the category to be deleted
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TagEditor
   */
  handleCategoryDeletion(id, e) {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to REMOVE this category? This will remove all tags associated with this category.')) {
      this.setState((state, props) => {
        let categoryState = this.props.getAllCategoriesById[id];
        this.props.onCategoryDelete({
          categoryState,
          id
        });

        return {
          currentCategory: null
        }
      });
      this.setState({currentCategory: null});
    }
  }

  /**
   * Handler for tag edit field onchange event.
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TagEditor
   */
  handleTagOnChange(e) {
    let name = e.target.value;
    let id = e.target.id.replace('tag-edit-', '');
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

  /**
   * Handler for tag edit element click
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TagEditor
   */
  handleTagEdit(e) {
    let name = e.target;
    let input = name.nextSibling;
    input.classList.remove('hide');
    input.style.display = 'inline';
    input.focus();
    input.setSelectionRange(0, -1);
    name.classList.add('hide');
  }

  /**
   * Handler for tag edit field onblur event. Used to hide edit field when clicked elsewhere on the screen.
   *
   * @param {SyntheticEvent} e React's event wrapper
   * @memberof TagEditor
   */
  handleTagEditDone(e) {
    e.target.previousSibling.classList.remove('hide');
    e.target.classList.add('hide');
  }

  /**
   * Handler for tag delete button click event callback
   *
   * @param {string} id Id of the tag to be deleted
   * @param {string} cat Id of the category the tag belongs to
   * @memberof TagEditor
   */
  handleTagDeletion(id, cat) {
    this.props.onTagDelete(id);
    this.setState({
      currentCategory: cat
    });
  }

  /**
   * Builds a list of categories
   *
   * @todo Move into its own component to manage state better
   * @returns {ReactElement} Markup for list of categories in JSX
   * @memberof TagEditor
   */
  buildCategoryList() {
    if (this.props.getAllCategories.length > 0) {
      return this.props.getAllCategories.map((id, idx) => {
        return (
          <div className={"collection-item category " + ((this.state.currentCategory === id) ? 'active light-blue' : '')}
            id={id}
            key={idx}>
            <div>
              <span
                onClick={this.handleCategoryEdit}
                style={{ textTransform: 'capitalize' }}
                className="category-name">{this.props.getAllCategoriesById[id].name}</span>
              <input
                id={'category-edit-' + id}
                style={{
                  width: 'calc(100% - 85px)',
                  height: 'auto',
                }}
                className={"hide " + ((this.state.currentCategory === id) ? 'white-text' : '')}
                onBlur={this.handleCategoryEditDone}
                onChange={this.handleCategoryOnChange}
                type="text"
                value={this.props.getAllCategoriesById[id].name} />
              <a href="#!"
                onClick={(e) => this.handleCategoryDeletion(id, e)}
                className={"secondary-content " + ((this.state.currentCategory === id ? 'white-text' : 'red-text'))}><i className="material-icons">delete</i></a>
              <a href="#!"
                onClick={(e) => this.handleCategorySelection(id, e)}
                className={"secondary-content " + ((this.state.currentCategory === id ? 'white-text' : 'light-blue-text'))}><i className="material-icons">local_offer</i></a>
            </div>
          </div>
        )
      });
    }
  }

  /**
   * Builds a list of tags when given a category ID, otherwise show a message asking to select category
   *
   * @todo Move into its own component to manage state better
   * @param {string} currentCategory Category ID used to generate list of tags
   * @returns {ReactElement} Markup for list of tags in JSX
   * @memberof TagEditor
   */
  buildTagList(currentCategory) {
    if (!currentCategory) {
      return (
        <div className="collection-item category">
          Choose a category to add tags.
        </div>
      );
    }

    return (this.props.getAllCategoriesById[currentCategory] && this.props.getAllCategoriesById[currentCategory].tags.length === 0)
    ? <div className="collection-item tag-empty">No tags found in this category. Click Add Tag above to create a new tag.</div>
    : this.props.getAllTags
      .filter(id => this.props.getAllTagsById[id] && this.props.getAllTagsById[id]['category'] === currentCategory)
      .map((id, idx) => {
        return (
          <div className="collection-item tag"
            id={id}
            key={idx}>
            <div>
              <span
                style={{textTransform: 'capitalize'}}
                onClick={this.handleTagEdit}
                className="tag-name">{this.props.getAllTagsById[id].name}</span>
              <input
                id={'tag-edit-' + id}
                style={{  width: 'calc(100% - 35px)', height: 'auto' }}
                className="hide"
                onBlur={this.handleTagEditDone}
                onChange={this.handleTagOnChange}
                type="text"
                value={this.props.getAllTagsById[id].name}/>
              <a href="#!"
                onClick={(e) => this.handleTagDeletion(id, currentCategory)}
                className="secondary-content red-text"><i className="material-icons">delete</i></a>
            </div>
          </div>
        )
      });
  }

  /**
   * Message displayed when tag list is empty
   *
   * @returns {ReactElement} Markup for message in JSX
   * @memberof TagEditor
   */
  noTagMessage() {
    return (
      <div className="collection-item category">
        No tags found in this category. Click add tag to create a new one.
      </div>
    )
  }

  /**
   * Builds the tag editing modal
   *
   * @returns {ReactElement} Markup for modal in JSX
   * @memberof TagEditor
   */
  buildModal() {
    return (
      <div className="tag-editor">
        <div id="modal-manage-tag" className="modal bottom-sheet">
          <div className="modal-content">
            <div className="row">
              <div className="col s12">
                <h5>Edit Tags and Categories</h5>
                <p>Click on a category or tag name to edit it. Click the
                  <button
                    style={{ padding: '0 .25rem'}}
                    className="btn-flat disabled grey">
                  <i className="material-icons">local_offer</i>
                  </button> button to view and edit the tags associated with that category.
                  Use the
                  <button
                    style={{ padding: '0 .25rem' }}
                    className="btn-flat disabled grey">
                    <i className="material-icons">delete</i>
                  </button> button to delete a category or tag.</p>
              </div>
            </div>
            {this.buildEditor()}
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Builds the tag editing UI
   *
   * @returns {ReactElement} Markup for tag editing form in JSX
   * @memberof TagEditor
   */
  buildEditor() {
    return (
      <div className="tag-editor-form">
        <div className="row">
          <div className="col s12 m6">
            <div className="collection with-header" style={{overflow:'visible'}}>
              <div className="collection-header tag-editor-header row valign-wrapper">
                <h6 className="grey-text header-add-category">Categories</h6>
                <button
                  onClick={this.handleAddCategory}
                  className="btn-flat btn-add-category">
                  <i className="material-icons left">add</i>
                  Add Category
                </button>
              </div>
              {this.buildCategoryList()}
            </div>
          </div>
          <div className="col s12 m6">

            <div className="collection with-header" style={{overflow:'visible'}}>
              <div className="collection-header tag-editor-header row valign-wrapper">
                <h6 id="currentCat"
                  className="grey-text header-add-tag">
                  {(this.state.currentCategory)
                    ? 'Tags for category: '
                    : 'Tags (No category selected)'}
                  <span
                    className="light-blue-text"
                    style={{ textTransform: 'capitalize' }}>
                    {(this.props.getAllCategoriesById[this.state.currentCategory])
                      ? this.props.getAllCategoriesById[this.state.currentCategory].name
                      : ''}
                  </span>
                </h6>
                <button
                  disabled={(this.state.currentCategory === null)}
                  onClick={(e) => this.handleAddTag(this.state.currentCategory, e)}
                  className="btn-flat btn-add-tag">
                  <i className="material-icons left">add</i>
                  Add Tag
                </button>
              </div>
              {this.buildTagList(this.state.currentCategory)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.buildModal();
  }
}
