import {connect} from 'react-redux';
import TagUi from '../components/TagUi';
import TagEditor from '../components/TagEditor'
import { addTag, updateTag, deleteTag, addCategory, updateCategory, deleteCategory, filterCategory } from '../store/actions/tags';
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

const getFilteredCategories = (state) => {
  return state.filterCategories;
}

const mapTagStateToProps = globalState => {
  let state = globalState.tagState;

  return {
    getAllTagsById: getAllTagsById(state),
    getAllTags: getAllTags(state),
    getAllCategoriesById: getAllCategoriesById(state),
    getAllCategories: getAllCategories(state),
    getFilteredCategories: getFilteredCategories(state),
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
    onCategoryUpdate({categoryState, id}) {
      dispatch(updateCategory({categoryState, id}));
    },
    onCategoryDelete({categoryState, id}) {
      dispatch(deleteCategory({ categoryState, id }));
      window.showToast('Category Deleted');
    },
    onCategoryFilter(categoryIdList, id, mode, catName) {
      let visibilityType = (mode)
        ? 'Hiding'
        : 'Showing';

      dispatch(filterCategory(categoryIdList));
      window.showToast(`${visibilityType} timers with ${catName} tags`);
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
