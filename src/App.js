import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import PrivateRoute from './lib/PrivateRoute'
import LoadingCurtain from './containers/LoadingCurtain';
import MainMenu from './containers/MainMenu';
import HomePage from './views/HomePage';
import Dashboard from './views/Dashboard';
import { useAuth0 } from './lib/my-auth0';

const App = () => {
  const { isReady, isLoading, isAuthenticated } = useAuth0();

  return (
    <div>
      <p>isReady: {isReady.toString()}</p>
      <p>isLoading: {isLoading.toString()}</p>
      <p>isAuthenticated: {isAuthenticated.toString()}</p>
      <hr />

      <MainMenu />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/dashboard" exact component={Dashboard} />
      </Switch>

      <LoadingCurtain />
    </div>
  )
}

export default App;
