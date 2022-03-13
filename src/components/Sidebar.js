import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

// Avatar component
import Avatar from './Avatar';

export default function Sidebar() {
  // import user state which will have photoURL for our avatar
  const { user } = useAuthContext();
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {user && (
          <div className="user">
            <Avatar src={user.photoURL} />
            <p>Hey, {user.displayName}</p>
          </div>
        )}

        <div className="links">
          <ul>
            <li>
              <NavLink to="/">
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/create">
                <span>New Project</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
