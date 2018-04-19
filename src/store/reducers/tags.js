import { ADD_TAG, UPDATE_TAG, DELETE_TAG, ADD_CATEGORY, DELETE_CATEGORY } from '../actions/tags';

export const initTag = {
  name: '',
  category: ''
}

export const initTagState = {
  tagsById: {},
  tags: []
}

export const initTagCategoryState = {
  tagCategoriesById: {},
  tagCategories: []
}

function tagsById (state = {}, action) {
  switch (action.type) {
    case ADD_TAG: {
      let tagState = {
        ...initTag,
        ...action.tagState
      }
      return {
        ...state,
        [action.id]: Object.keys(action.tagState).length > 0
          ? tagState
          : initTag
      }
    }
    case UPDATE_TAG: {
      Object.entries(state).map(([id, tagState]) => {
        let updatedState = (id === action.id)
          ? action.tagState
          : tagState;

        state[id] = Object.keys(action.tagState).length > 0
          ? updatedState
          : initTag;

        return [id, tagState];
      });
      return state;
    }
    case DELETE_TAG: {
      delete state[action.id];
      return state;
    }
    default: {
      return state;
    }
  }
}

function tags (state = [], action) {
  switch (action.type) {
    case ADD_TAG: {
      return [
        ...state,
        action.id
      ];
    }
    case DELETE_TAG: {
      if (state.indexOf(action.id) !== -1) {
        state.splice(state.indexOf(action.id), 1)
      }
      return state;
    }
    default: {
      return state;
    }
  }
}

function categoriesById(state = {}, action) {
  switch (action.type) {
    case ADD_CATEGORY: {
      return {
        ...state,
        [action.id]: Object.keys(action.categoryName).length > 0
          ? action.categoryName
          : 'No Name Given'
      }
    }
    default: {
      return state;
    }
  }
}

function categories(state = [], action) {
  switch (action.type) {
    case ADD_CATEGORY: {
      return [
        ...state,
        action.id
      ];
    }
    default: {
      return state;
    }
  }
}

export const tagState = (state = {}, action) => {
  return {
    tagsById: tagsById(state.tagsById, action),
    tags: tags(state.tags, action),
    categoriesById: categoriesById(state.categoriesById, action),
    categories: categories(state.categories, action),
  }
}
