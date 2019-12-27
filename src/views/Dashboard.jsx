import React from 'react';
import { withAuth } from '../lib/my-auth0';

const Dashboard = ({ auth }) => (
  <div>
    Welcome {auth.user.email}
    <button onClick={auth.logout}>logout</button>
  </div>
);

export default withAuth(Dashboard);
