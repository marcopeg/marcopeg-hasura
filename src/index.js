import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Auth0Provider } from './lib/my-auth0';
import history from './lib/history';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(
  <Auth0Provider
    domain={'marcopeg.eu.auth0.com'}
    client_id={'1dFca4fBVhVYhMiF9K96EL6lsfmqRgD6'}
    audience={'https://marcopeg.eu.auth0.com/api/v2/'}
    redirect_uri={window.location.origin}
  >
    <Router history={history}>
      <App />
    </Router>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
