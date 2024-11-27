import React from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  return (
    <div>
      <h2>User Management</h2>
      <ul>
        <li>
          <Link to="/users/create">Create User</Link>
        </li>
        <li>
          <Link to="/users/update">Update User</Link>
        </li>
        <li>
          <Link to="/users/delete">Delete User</Link>
        </li>
      </ul>
    </div>
  );
};

export default UserManagement;