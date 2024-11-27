import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleLogin = async () => {
      try {
        console.log('Attempting login with:', { email, password }); // Debug logging
        const response = await axios.post(
          'http://localhost:5000/api/auth/login',
          {
            email,
            password,
          },
        );
        const newToken = response.data.token;
        Cookies.set('token', newToken, { expires: 1 });
        window.location.href = '/';
      } catch (err: any) {
        console.error('Login error:', err.response?.data || err); // Better error logging
        setError(err.response?.data?.message || 'Login failed');
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Login
          </h2>
          {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username"
            className="w-full py-2 px-4 mb-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full py-2 px-4 mb-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          />
          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </div>
      </div>
    );
  }