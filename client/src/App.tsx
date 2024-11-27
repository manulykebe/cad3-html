import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import AppContent from './content/MainApp';
import LoginContent from './content/Login';
import SketchupConsoleContent from './content/SketchupConsole';

import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const NavMenu = styled.nav`
  background: #333;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const NavItem = styled(NavLink)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;

  &.active {
    background: #666;
  }

  &:hover {
    background: #444;
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Add any additional logout logic here (clear tokens etc)
  };
  return (
    <ThemeProvider>
      <Router>
        <NavMenu>
          <NavItem to="/">Home</NavItem>
          {/* <NavItem to="/sketchupConsole">Sketchup Console</NavItem> */}
          {isLoggedIn ? (
            <NavItem to="/" onClick={handleLogout}>Logout</NavItem>
          ) : (
            <NavItem to="/login">Login</NavItem>
          )}
        </NavMenu>
        <Routes>
          <Route path="/login" element={<LoginContent />} />
          <Route path="/" element={<AppContent />} />
          <Route path="/sketchupConsole" element={<SketchupConsoleContent />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
