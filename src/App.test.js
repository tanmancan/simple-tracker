import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store';
import * as timerActions from './store/actions/timer';
import * as tagActions from './store/actions/tags';
import './index.css';
import TimerApp from './containers/TimerApp';
import registerServiceWorker from './registerServiceWorker';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <TimerApp />
    </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
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

  const newCatState = {
    ...categoryState,
    tags: [tagId]
  };

  expect(tag).toEqual(tagState);
  expect(category).toEqual(newCatState);
  expect(category.tags).toContain(tagId);
  expect(category.tags.length).toBe(1);

  store.dispatch(tagActions.deleteCategory({
    categoryState: newCatState,
    id: catId
  }));

  const deletedState = store.getState();
  const deletedTag = deletedState.tagState.tagsById[tagId];
  const deletedCategory = deletedState.tagState.categoriesById[catId];

  expect(deletedTag).toBeUndefined();
  expect(deletedCategory).toBeUndefined();
});
