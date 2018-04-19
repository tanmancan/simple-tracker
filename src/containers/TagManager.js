import {connect} from 'react-redux';
import TagUi from '../components/TagUi';
import TagEditor from '../components/TagEditor'
import { addTag, updateTag, deleteTag, addCategory, deleteCategory } from '../store/actions/tags';
import { initTag, initCategory } from '../store/reducers/tags';

const getAllTagsById = (state) => {
  return state.tagsById;
}

const getAllTags = (state) => {
  return state.tags;
}

const getAllCategoriesById = (state) => {
  return state.categoriesById;
}

const getAllCategories = (state) => {
  return state.categories;
}

const mapTagStateToProps = globalState => {
  let state = globalState.tagState;

  return {
    getAllTagsById: getAllTagsById(state),
    getAllTags: getAllTags(state),
    getAllCategoriesById: getAllCategoriesById(state),
    getAllCategories: getAllCategories(state),
  }
}

const mapTagDispatchToProps = dispatch => {
  return {
    onTagAdd: ({ name, category }) => {
      let uid = +`${Math.floor(Math.random() * 1000)}${+new Date()}`;
      let id = `tag-${uid}`;
      let tagState = {
        ...initTag,
        name,
        category
      }
      dispatch(addTag({tagState, id}));
      window.showToast('Tag Added');
    },
    onTagUpdate({tagState, id}) {
      dispatch(updateTag({tagState, id}));
      window.showToast('Tag Updated');
    },
    onTagDelete: (id) => {
      dispatch(deleteTag(id))
      window.showToast('Tag Deleted');
    },
    onCategoryAdd: ({ name }) => {
      let uid = +`${Math.floor(Math.random() * 1000)}${+new Date()}`;
      let id = `category-${uid}`;
      let categoryState = {
        ...initCategory,
        name,
      }
      dispatch(addCategory({ categoryState, id }));
      window.showToast('Category Added');
    },
    onCategoryDelete({categoryState, id}) {
      dispatch(deleteCategory({ categoryState, id }));
      window.showToast('Category Deleted');
    }
  }
};

export const TagList = connect(
  mapTagStateToProps,
  mapTagDispatchToProps
)(TagUi);

export const TagEditorModal = connect(
  mapTagStateToProps,
  mapTagDispatchToProps
)(TagEditor);
