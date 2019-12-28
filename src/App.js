import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoadingCurtain from './containers/LoadingCurtain';
import MainMenu from './containers/MainMenu';
import HomePage from './views/HomePage';
import Dashboard from './views/Dashboard';
import Journal from './views/Journal';

const App = () => (
  <div>
    <MainMenu />
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/journal" exact component={Journal} />
    </Switch>
    <LoadingCurtain />
  </div>
);

export default App;
