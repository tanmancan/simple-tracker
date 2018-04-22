import store from '../store';
import * as timerActions from '../store/actions/timer';
import * as tagActions from '../store/actions/tags';

const initTimerState = {
  title: '',
  description: '',
  timerRunning: false,
  timeProgress: 0,
  timeStart: null,
  timerStartDate: null,
  tags: {}
};

const initState = {
  timerState:
    {
      timerDrag: false,
      timerById: {},
      timers: [],
      activeTimer: [],
      deletedTimersById: {},
      deletedTimers: []
    },
  tagState:
    {
      tagsById: {
        exampletag: {
          name: 'Example Tag',
          category: 'examplecategory'
        }
      },
      tags: ['exampletag'],
      categoriesById: {
        examplecategory: {
          name: 'Example Category',
          tags: ['exampletag']
        }
      },
      categories: ['examplecategory'],
      filterCategories: []
    }
};

it('verify state created correctly', () => {
  expect(store.getState()).toEqual(initState);
});

it('create a new timer', () => {
  const id = 'timer-id-test-timer-create';
  const timerState = {
    ...initTimerState,
    timerStartDate: 1524435405445,
    title: id,
    description: `Description for timer ${id}`
  }
  store.dispatch(timerActions.addTimer({timerState, id}));

  const state = store.getState();

  expect(state.timerState.timerById[id]).toEqual(timerState);
  expect(state.timerState.timers).toContain(id);
});

it('delete a timer', () => {
  const id = 'timer-id-test-timer-create';
  const timerState = {
    ...initTimerState,
    timerStartDate: 1524435405445,
    title: id,
    description: `Description for timer ${id}`
  }

  store.dispatch(timerActions.deleteTimer({timerState, id}));

  const state = store.getState();

  expect(state.timerState.timerById[id]).toBeUndefined();
  expect(state.timerState.timers.length).toBe(0);
  expect(state.timerState.deletedTimersById[id]).toEqual(timerState);
  expect(state.timerState.deletedTimers).toContain(id);
});

it('create a new tag under the example category', () => {
  const tagState = {
    name: 'Test Tag',
    category: 'examplecategory'
  };
  const id = 'test-tag-id-example-category';

  store.dispatch(tagActions.addTag({ tagState, id }))

  const state = store.getState();

  expect(state.tagState.tagsById[id]).toEqual(tagState);
});

it('create a new category, with no tags', () => {
  const categoryState = {
    name: 'Test Category',
    tags: [],
  }
  const id = 'test-category-id-no-tags';

  store.dispatch(tagActions.addCategory({ categoryState, id }));

  const state = store.getState();
  const category = state.tagState.categoriesById[id];

  expect(category).toEqual(categoryState);
  expect(category.tags.length).toBe(0);
});

it('create a new category, then add a tag to it', () => {
  const categoryState = {
    name: 'Test Category',
    tags: [],
  }
  const catId = 'test-category-id-with-tag';

  store.dispatch(tagActions.addCategory({ categoryState, id: catId }));

  const tagState = {
    name: 'Test Tag',
    category: 'test-category-id-with-tag'
  };
  const tagId = 'test-tag-id-add-to-cat';

  store.dispatch(tagActions.addTag({ tagState, id: tagId }))

  const state = store.getState();
  const tag = state.tagState.tagsById[tagId];
  const category = state.tagState.categoriesById[catId];

  expect(tag).toEqual(tagState);
  expect(category).toEqual({
    ...categoryState,
    tags: [tagId]
  });
  expect(category.tags).toContain(tagId);
  expect(category.tags.length).toBe(1);
});

it('create a new category, then add a tag to it, then delete the category', () => {
  const categoryState = {
    name: 'Test Category',
    tags: [],
  }
  const catId = 'test-category-id-delete';

  store.dispatch(tagActions.addCategory({ categoryState, id: catId }));

  const tagState = {
    name: 'Test Tag',
    category: 'test-category-id-delete'
  };
  const tagId = 'test-tag-id-delete';

  store.dispatch(tagActions.addTag({ tagState, id: tagId }))

  const state = store.getState();
  const tag = state.tagState.tagsById[tagId];
  const category = state.tagState.categoriesById[catId];

  const catStateWithTag = {
    ...categoryState,
    tags: [tagId]
  };

  expect(tag).toEqual(tagState);
  expect(category).toEqual(catStateWithTag);
  expect(category.tags).toContain(tagId);
  expect(category.tags.length).toBe(1);

  store.dispatch(tagActions.deleteCategory({
    categoryState: catStateWithTag,
    id: catId
  }));

  const deletedState = store.getState();
  const deletedTag = deletedState.tagState.tagsById[tagId];
  const deletedCategory = deletedState.tagState.categoriesById[catId];

  expect(deletedTag).toBeUndefined();
  expect(deletedCategory).toBeUndefined();
});
