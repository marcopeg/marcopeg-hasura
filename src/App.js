import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoadingCurtain from './containers/LoadingCurtain';
import HomePage from './views/HomePage';
import Dashboard from './views/Dashboard';
import Journal from './views/Journal';
import JournalEntry from './views/JournalEntry';

const App = () => (
  <>
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/journal/write/:date" exact component={JournalEntry} />
      <Route path="/journal" exact component={Journal} />
      <Route path="/dashboard" exact component={Dashboard} />
    </Switch>
    <LoadingCurtain />
  </>
);

export default App;
