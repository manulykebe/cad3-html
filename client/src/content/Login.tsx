import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
    const handleLogin = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/login',
          {
            email,
            password,
          },
        );
        const newToken = response.data.token;
      login(newToken);
      navigate('/');
      } catch (err: any) {
      console.error('Login error:', err.response?.data || err);
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