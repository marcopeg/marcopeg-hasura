import React from 'react';
import { useAuth0 } from './lib/auth0';

const App = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0;
  console.log(isAuthenticated, loginWithRedirect)

  if (isAuthenticated) {
    return 'you are logged in'
  }

  return (
    <div onClick={loginWithRedirect}>login!</div>
  )
}

export default App;
