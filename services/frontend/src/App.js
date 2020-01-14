import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoadingCurtain from './containers/LoadingCurtain';
import HomePage from './views/HomePage';
import Dashboard from './views/Dashboard';
import Journal from './views/Journal';
import JournalNotes from './views/JournalNotes';
import ExpenseHistory from './views/ExpenseHistory';
import SuccessModal from './containers/SuccessModal';
import UpdateScreen from './containers/UpdateScreen';

const IonRoutes = () => (
  <IonReactRouter>
    <IonRouterOutlet id={'main'}>
      <Route path="/journal/notes" exact component={JournalNotes} />
      <Route path="/journal" exact component={Journal} />
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/expense" exact component={ExpenseHistory} />
      <Route path="/" exact component={HomePage} />
    </IonRouterOutlet>
  </IonReactRouter>
)

const App = () => (
  <>
    <Switch>
      <Route path="/(dashboard|journal|expense)" component={IonRoutes} />
      <Route path="/" exact component={HomePage} />
    </Switch>
    <SuccessModal />
    <UpdateScreen />
    <LoadingCurtain />
  </>
);

export default App;
