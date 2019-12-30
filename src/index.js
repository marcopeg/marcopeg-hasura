import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { IonApp } from '@ionic/react';
import { AuthProvider } from './lib/auth';
import history from './lib/history';
import { ApolloProvider } from './lib/apollo';
import App from './App';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Custom Styles */
import './index.css';

ReactDOM.render(
  <IonApp>
    <AuthProvider
      domain={'marcopeg.eu.auth0.com'}
      client_id={'1dFca4fBVhVYhMiF9K96EL6lsfmqRgD6'}
      audience={'https://marcopeg.eu.auth0.com/api/v2/'}
      redirect_uri={window.location.origin}
    >
      <ApolloProvider>
        <Router history={history}>
          <App />
        </Router>
      </ApolloProvider>
    </AuthProvider>
  </IonApp>,
  document.getElementById('root')
);
