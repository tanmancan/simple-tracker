import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store';
import './index.css';
import './assets/iconfont/material-icons.css';
import './assets/lato/lato.css';
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

if (process.env['REACT_APP_GA']) {
  const dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', process.env['REACT_APP_GA']);
}

registerServiceWorker();
