import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import PrivateRoute from './lib/PrivateRoute'
import LoadingCurtain from './containers/LoadingCurtain';
import MainMenu from './containers/MainMenu';
import HomePage from './views/HomePage';
import Dashboard from './views/Dashboard';

const App = () => (
  <div>
    <MainMenu />
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/dashboard" exact component={Dashboard} />
    </Switch>
    <LoadingCurtain />
  </div>
);

export default App;
