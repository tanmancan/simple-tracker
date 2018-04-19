import React, { Component } from 'react';
import rand from 'random-words';

export default class TagEditor extends Component {
  constructor(props) {
    super(props);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleCategorySelection = this.handleCategorySelection.bind(this);
    this.handleTagOnChange = this.handleTagOnChange.bind(this);
    this.handleTagEdit = this.handleTagEdit.bind(this);
    this.handleTagEditDone = this.handleTagEditDone.bind(this);
    this.handleTagDeletion = this.handleTagDeletion.bind(this);
    this.state = {
      currentCategory: null,
    }
  }

  handleAddTag(cat) {
    console.log(rand());
    this.props.onTagAdd({
      name: rand(),
      category: cat
    });
  }

  handleAddCategory() {
    this.props.onCategoryAdd({
      categoryName: rand(),
      id: rand()
    });
  }

  handleCategorySelection(cat) {
    console.log(cat);
    this.setState((state, props) => {
      return {
        currentCategory: cat
      }
    })
  }

  handleTagOnChange(e) {
    console.log(e.target.value);
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
    console.log(e.target);
    let name = e.target;
    let input = name.nextSibling;
    input.classList.remove('hide');
    input.style.display = 'inline';
    input.focus();
    input.setSelectionRange(0, -1);
    name.style.display = 'none';
  }

  handleTagEditDone(e) {
    e.target.previousSibling.style.display = 'inline';
    e.target.classList.add('hide');
  }

  handleTagDeletion(id, cat) {
    this.props.onTagDelete(id);
    this.setState({
      currentCategory: cat
    });
  }

  buildCategoryList() {
    if (this.props.getAllCategories.length > 0) {
      let catList = this.props.getAllCategories.map((id, idx) => {
        return (
          <a href="#currentCat" className="collection-item category"
            onClick={(e) => this.handleCategorySelection(id, e)}
            id={id}
            key={idx}>
            {id}
          </a>
        )
      });
      return catList;
    }
  }

  buildTagList(currentCategory) {
    // @TODO: move into its own component to manage state better
    if (this.props.getAllTags.length > 0) {
      let tagList = this.props.getAllTags
        .filter(id => this.props.getAllTagsById[id]['category'] === currentCategory)
        .map((id, idx) => {
          return (
            <div className="collection-item tag"
              id={id}
              key={idx}>
              <div>
                <span
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
      return tagList;
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
                <button onClick={this.handleAddCategory} className="btn btn-flat" style={{ flex: '0 0 100px' }}>
                  <i className="material-icons left">add</i>
                  Add
                </button>
              </div>
              {this.buildCategoryList()}
            </div>
          </div>
          <div className="col s12 m6">

            <div className="collection with-header">
              <div className="collection-header row valign-wrapper" style={this.listHeaderStyle()}>
                <h5 id="currentCat" className="grey-text" style={{ flex: '1 0 50%', margin: 0 }}>{this.state.currentCategory || ''} Tags</h5>
                <button onClick={(e) => this.handleAddTag(this.state.currentCategory, e)} className="btn btn-flat" style={{ flex: '0 0 100px' }}>
                  <i className="material-icons left">add</i>
                  Add
                </button>
              </div>
              {this.buildTagList(this.state.currentCategory)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
