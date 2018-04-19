import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store';
import './index.css';
import TimerApp from './containers/TimerApp';
import registerServiceWorker from './registerServiceWorker';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';

ReactDOM.render(
  <Provider store={store}>
    <TimerApp />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
