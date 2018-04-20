import { ADD_TAG, UPDATE_TAG, DELETE_TAG, ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from '../actions/tags';

export const initTag = {
  name: '',
  category: '',
}

export const initCategory = {
  name: '',
  tags: []
}

export const initTagState = {
  tagsById: {
    exampletag: {
      name: 'Example Tag',
      category: 'examplecategory'
    }
  },
  tags: ['exampletag']
}

export const initCategoryState = {
  categoriesById: {
    examplecategory: {
      name: 'Example Category',
      tags: ['exampletag']
    }
  },
  categories: ['examplecategory']
}

function tagsById(state = initTagState.tagsById, action) {
  switch (action.type) {
    case ADD_TAG: {
      let newState = {
        ...state
      }
      let tagState = {
        ...initTag,
        ...action.tagState
      }
      return {
        ...newState,
        [action.id]: Object.keys(action.tagState).length > 0
          ? tagState
          : initTag
      }
    }
    case UPDATE_TAG: {
      let newState = {
        ...state
      }
      Object.entries(newState).map(([id, tagState]) => {
        let updatedState = (id === action.id)
          ? action.tagState
          : tagState;

        newState[id] = Object.keys(action.tagState).length > 0
          ? updatedState
          : initTag;

        return [id, tagState];
      });
      return newState;
    }
    case DELETE_TAG: {
      let newState = {
        ...state
      };
      delete newState[action.id];
      return newState;
    }
    case DELETE_CATEGORY: {
      let deletedTags = action.categoryState.tags;
      let newState = {...state};
      deletedTags.map(tagName => {
        if (newState[tagName]) {
          delete newState[tagName];
        }
        return tagName;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}

function tags(state = initTagState.tags, action) {
  switch (action.type) {
    case ADD_TAG: {
      let newState = [...state];
      return [
        ...newState,
        action.id
      ];
    }
    case DELETE_TAG: {
      let newState = [
        ...state
      ];
      if (newState.indexOf(action.id) !== -1) {
        newState.splice(newState.indexOf(action.id), 1)
      }
      return newState;
    }
    case DELETE_CATEGORY: {
      let deletedTags = action.categoryState.tags;
      let newState = [
        ...state
      ]
      deletedTags.map(tagName => {
        if (newState.indexOf(tagName) !== -1) {
          newState.splice(newState.indexOf(tagName), 1)
        }
        return deletedTags;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}

function categoriesById(state = initCategoryState.categoriesById, action) {
  switch (action.type) {
    case ADD_TAG: {
      let newState = {
        ...state
      }
      let tagCategory = action.tagState.category;
      return {
        ...newState,
        [tagCategory]: {
          ...newState[tagCategory],
          tags: [
            ...newState[tagCategory].tags,
            action.id
          ]
        }
      }
    }
    case DELETE_TAG: {
      let newState = {
        ...state
      }
      Object.entries(newState).map(([id, category]) => {
        let tags = category.tags;
        if (tags.indexOf(action.id) !== -1) {
          tags.splice(tags.indexOf(action.id), 1)
        }
        return [id, category];
      });
      return newState;
    }
    case ADD_CATEGORY: {
      let newState = {
        ...state
      }
      let categoryState = {
        ...initCategory,
        ...action.categoryState
      }
      return {
        ...newState,
        [action.id]: Object.keys(action.categoryState).length > 0
          ? categoryState
          : initCategory
      }
    }
    case UPDATE_CATEGORY: {
      let newState = {
        ...state
      }
      Object.entries(newState).map(([id, categoryState]) => {
        let updatedState = (id === action.id)
          ? action.categoryState
          : categoryState;

        newState[id] = Object.keys(action.categoryState).length > 0
          ? updatedState
          : initCategory;

        return [id, categoryState];
      });
      return newState;
    }
    case DELETE_CATEGORY: {
      let newState = {
        ...state
      }
      delete newState[action.id];
      return newState;
    }
    default: {
      return state;
    }
  }
}

function categories(state = initCategoryState.categories, action) {
  switch (action.type) {
    case ADD_CATEGORY: {
      return [
        ...state,
        action.id
      ];
    }
    case DELETE_CATEGORY: {
      let newState = [...state];
      if (newState.indexOf(action.id) !== -1) {
        newState.splice(newState.indexOf(action.id), 1)
      }
      return newState;
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
