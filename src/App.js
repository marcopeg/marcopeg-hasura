import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoadingCurtain from './containers/LoadingCurtain';
import HomePage from './views/HomePage';
import Dashboard from './views/Dashboard';
import Journal from './views/Journal';
import JournalEntry from './views/JournalEntry';

const IonRoutes = () => (
  <IonReactRouter>
    <IonRouterOutlet id={'main'}>
      <Route path="/journal/write/:date" exact component={JournalEntry} />
      <Route path="/journal" exact component={Journal} />
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/" exact component={HomePage} />
    </IonRouterOutlet>
  </IonReactRouter>
)

const App = () => (
  <>
    <Switch>
      <Route path="/(dashboard|journal)" component={IonRoutes} />
      <Route path="/" exact component={HomePage} />
    </Switch>
    <LoadingCurtain />
  </>
);

export default App;
