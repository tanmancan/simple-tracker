import React, { Component } from 'react';

export default class TagUi extends Component {
  constructor(props) {
    super(props);
  }

  buildCategoryList() {
    if (this.props.getAllCategories.length > 0) {
      let catList = this.props.getAllCategories.map((id, idx) => {
        return (
          <ul id={id} key={id} className="collapsible collapsible-accordion">
            <li>
              <a className="collapsible-header">{id}<i className="material-icons">arrow_drop_down</i></a>
              <div className="collapsible-body">
                <ul>
                  <li>
                    <a>{id}stuff.</a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        )
      });
      return catList;
    }
  }

  buildTagList() {
    let tagList = this.props.getAllTags.map((id, idx) => {
      return <div id={id} key={id}><a href="#">{id}</a></div>
    });
  }

  render() {
    return(
      <li className="no-padding">
        <ul>
          <li>
            <a className="waves-effect waves-light btn modal-trigger" href="#modal1">Manage Tags</a>
          </li>
        </ul>
        {this.buildCategoryList()}
        <ul className="collapsible collapsible-accordion">
          <li>
            <a className="collapsible-header"><i className="material-icons">filter_drama</i>Tags</a>
            <div className="collapsible-body">
              <ul>
                {(this.props.getAllTags.length > 0)
                  ? (this.props.getAllTags).map(
                    (id, idx) => <li id={id} key={id}><a href="#">{id}</a></li>
                  )
                  : 'no tags'}
              </ul>
            </div>
          </li>
          <li>
            <div className="collapsible-header"><i className="material-icons">place</i>Second</div>
            <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
          </li>
          <li>
            <div className="collapsible-header"><i className="material-icons">whatshot</i>Third</div>
            <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
          </li>
        </ul>
      </li>
    );
  }
}
