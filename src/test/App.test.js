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
