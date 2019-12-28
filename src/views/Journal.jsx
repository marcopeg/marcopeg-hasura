import React from 'react';
import { withAuth } from '../lib/auth';

const Journal = ({ auth }) => (
  <div>
    Jourunal - {auth.isAuthenticated.toString()}
    </div>
);

export default withAuth(Journal);
