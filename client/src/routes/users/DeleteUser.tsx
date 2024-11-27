import React, { useState } from 'react';
import axios from 'axios';

const DeleteUser = () => {
  const [id, setId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/users/${id}`);
      setMessage('User deleted successfully');
    } catch (error) {
      setMessage('Error deleting user');
    }
  };

  return (
    <div>
      <h2>Delete User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="User ID"
          required
        />
        <button type="submit">Delete User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteUser;