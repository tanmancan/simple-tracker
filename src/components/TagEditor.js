import React, { Component } from 'react';
import rand from 'random-words';

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

  handleCategoryOnChange(e) {
    e.target.value;
    let name = e.target.value
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

  handleCategoryEdit(e) {
    e.stopPropagation();
    let editBtn = e.target.parentNode;
    console.log(editBtn);
    let input = editBtn.previousSibling;
    let name = input.previousSibling;
    name.classList.add('hide');
    input.classList.remove('hide');
    input.style.display = 'inline';
    input.focus();
    input.setSelectionRange(0, -1);
  }

  handleCategoryEditDone(e) {
    e.target.previousSibling.classList.remove('hide');
    e.target.classList.add('hide');
  }

  handleCategorySelection(cat, e) {
    this.setState((state, props) => {
      return {
        currentCategory: cat
      }
    })
  }

  handleCategoryDeletion(id, e) {
    e.stopPropagation();
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

  handleTagOnChange(e) {
    e.target.value;
    let name = e.target.value
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

  handleTagDeletion(id, cat) {
    this.props.onTagDelete(id);
    this.setState({
      currentCategory: cat
    });
  }

  selectedClassName(id) {
  }

  buildCategoryList() {
    if (this.props.getAllCategories.length > 0) {
      return this.props.getAllCategories.map((id, idx) => {
        return (
          <div className="collection-item category"
            onClick={(e) => this.handleCategorySelection(id, e)}
            id={id}
            key={idx}>
            <div>
              <span
                style={{ textTransform: 'capitalize' }}
                className="category-name">{this.props.getAllCategoriesById[id].name}</span>
              <input
                id={'category-edit-' + id}
                style={{ width: 'calc(100% - 35px)', height: 'auto' }}
                className="hide"
                onBlur={this.handleCategoryEditDone}
                onChange={this.handleCategoryOnChange}
                type="text"
                value={this.props.getAllCategoriesById[id].name} />
              <a href="#!"
                onClick={this.handleCategoryEdit}
                className="secondary-content green-text"><i className="material-icons">edit</i></a>
              <a href="#!"
                onClick={(e) => this.handleCategoryDeletion(id, e)}
                className="secondary-content orange-text"><i className="material-icons">delete</i></a>
            </div>
          </div>
        )
      });
    }
  }

  buildTagList(currentCategory) {
    // @TODO: move into its own component to manage state better
    if (this.props.getAllTags.length > 0) {
      return this.props.getAllTags
        .filter(id => this.props.getAllTagsById[id]['category'] === currentCategory)
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
                  className="secondary-content"><i className="material-icons">delete</i></a>
              </div>
            </div>
          )
        });
    }
  }

  // buildModal() {
  //   return (
  //     <div className="tag-editor">
  //       <div id="modal1" className="modal">
  //         <div className="modal-content">
  //           <h4>Modal Header</h4>
  //           <div className="row">
  //             <div className="col s6">
  //               <button onClick={this.handleAddCategory} className="btn">Add Category</button>
  //               {this.buildCategoryList()}
  //             </div>
  //             <div className="col s6">
  //               <button onClick={this.handleAddTag} className="btn">Add Tag</button>
  //               <p>Select a category from the left menu to add a Tag</p>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="modal-footer">
  //           <a href="#" className="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  listHeaderStyle() {
    return {
      display: 'flex',
      margin: 0,
    }
  }

  noTagMessage() {
    return (
      <div className="collection-item category">
        No tags found in this category. Click add tag to create a new one.
      </div>
    )
  }

  render() {
    return (
      <div className="tag-editor-form">
        <div className="row">
          <div className="col s12">
            <p>Click on a category name to add tags within that category.</p>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m6">
            <div className="collection with-header">
              <div className="collection-header row valign-wrapper" style={this.listHeaderStyle()}>
                <h5 className="grey-text" style={{flex: '1 0 50%',margin:0}}>Categories</h5>
                <button onClick={this.handleAddCategory} className="btn-flat" style={{ flex: '0 0 180px' }}>
                  <i className="material-icons left">add</i>
                  Add Category
                </button>
              </div>
              {this.buildCategoryList()}
            </div>
          </div>
          <div className="col s12 m6">

            <div className="collection with-header">
              <div className="collection-header row valign-wrapper" style={this.listHeaderStyle()}>
                <h5 id="currentCat" className="grey-text" style={{ flex: '1 0 50%', margin: 0 }}>
                  <span
                    style={{ textTransform: 'capitalize' }}>
                    {(this.props.getAllCategoriesById[this.state.currentCategory])
                      ? this.props.getAllCategoriesById[this.state.currentCategory].name
                      : ''}
                  </span> Tags
                </h5>
                <button
                  disabled={(this.state.currentCategory === null)}
                  onClick={(e) => this.handleAddTag(this.state.currentCategory, e)}
                  className="btn-flat"
                  style={{ flex: '0 0 130px' }}>
                  <i className="material-icons left">add</i>
                  Add Tag
                </button>
              </div>
              {(this.props.getAllCategoriesById[this.state.currentCategory] && this.props.getAllCategoriesById[this.state.currentCategory].tags.length === 0)
                ? this.noTagMessage()
                : this.buildTagList(this.state.currentCategory)}

              {(this.state.currentCategory)
                ? null
                : (
                  <div className="collection-item category">
                    Choose a category to add tags.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
