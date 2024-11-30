import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const NavMenu = styled.nav`
  background: #333;
  padding: 1rem;
  margin-bottom: 0rem;
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

const LogoutButton = styled.button`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: inherit;

  &:hover {
    background: #444;
  }
`;

const Navigation: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null;
  }
  return (
    <NavMenu>
      {isLoggedIn && (
        <>
      <NavItem to="/">Home</NavItem>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </>
      )}
    </NavMenu>
  );
};

export default Navigation;