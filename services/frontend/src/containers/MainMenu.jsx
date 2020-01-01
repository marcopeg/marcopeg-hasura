import React from 'react';
import { Link } from 'react-router-dom';

const MainMenu = () => (
  <div>
    <Link to="/">Home</Link>
    {' | '}
    <Link to="/dashboard">Dashboard</Link>
    {' | '}
    <Link to="/journal">Journal</Link>
  </div>
);

export default MainMenu;
