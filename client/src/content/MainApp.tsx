declare const sketchup: any;

import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function AppContent() {
  const { isDark, toggle } = useTheme();
  const [serverMessage, setServerMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(Cookies.get('token') || '');

  const [entries, setEntries] = useState<string[]>([]);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    // Request initial entries from SketchUp
    if (token && typeof sketchup !== 'undefined') {
      sketchup.getEntries();
    }
  }, [token]);

  // Define the updateDropdown function and attach it to the window object
  const updateDropdown = (entries: string[]) => {
    setEntries(entries);
  };

  useEffect(() => {
    // Attach the updateDropdown function to the window object
    (window as any).updateDropdown = updateDropdown;
    (window as any).updateExportOutput = updateExportOutput;
  }, []);

  const [outputContent, setOutputContent] = useState('');

  const updateExportOutput = (content: JSON) => {
    setOutputContent(JSON.stringify(content, null, 4));
  };

  const handleExportV12 = () => {
    if (typeof sketchup !== 'undefined') {
      sketchup.exportV12(false);
    }
  };

  const handleSetOriginal = () => {
    if (typeof sketchup !== 'undefined') {
      const selectedEntry = (
        document.getElementById('entriesDropdown') as HTMLSelectElement
      ).value;
      sketchup.setOriginalState(selectedEntry);
    }
  };

  const handleSetNew = () => {
    if (typeof sketchup !== 'undefined') {
      const selectedEntry = (
        document.getElementById('entriesDropdown') as HTMLSelectElement
      ).value;
      sketchup.setNewState(selectedEntry);
    }
  };

  const handleGetOriginal = () => {
    if (typeof sketchup !== 'undefined') {
      const selectedEntry = (
        document.getElementById('entriesDropdown') as HTMLSelectElement
      ).value;
      sketchup.getOriginalState(selectedEntry);
    }
  };

  const handleGetNew = () => {
    if (typeof sketchup !== 'undefined') {
      const selectedEntry = (
        document.getElementById('entriesDropdown') as HTMLSelectElement
      ).value;
      sketchup.getNewState(selectedEntry);
    }
  };

  const handleAddEntry = () => {
    if (typeof sketchup !== 'undefined' && newEntry) {
      sketchup.addEntry(newEntry);
      setNewEntry('');
    }
  };

  const login = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email: 'admin@lyke.be', password: 'admin' },
      );
      const newToken = response.data.token;
      Cookies.set('token', newToken, { expires: 1 }); // Expires in 1 day
      setToken(newToken);
    } catch (err) {
      setError('Login failed');
    }
  };

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        if (!token) {
          await login();
          return;
        }

        const response = await axios.get('http://localhost:5000/api/health', {
          headers: { Authorization: `Bearer ${token}` },
        });
        debugger;
        setServerMessage(response.data.message);
        setLoading(false);
      } catch (err) {
        setError('Failed to connect to server');
        setLoading(false);
      }
    };

    fetchGreeting();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <ThemeToggle isDark={isDark} toggle={toggle} />
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-xl p-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Server Status
              </h2>
              {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              ) : error ? (
                <p className="text-red-500 dark:text-red-400">{error}</p>
              ) : (
                <p className="text-green-600 dark:text-green-400">
                  {serverMessage}
                </p>
              )}
            </div>
            <div className="h-48 overflow-auto font-mono whitespace-pre rounded-md bg-gray-50 p-4">
              <button
                onClick={handleExportV12}
                className="w-48 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Export V12{' '}
              </button>
              <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                {outputContent}
              </pre>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleSetOriginal}
                className="w-48 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Set Original State
              </button>
              <button
                onClick={handleSetNew}
                className="w-48 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Set New State
              </button>
              <button
                onClick={handleGetOriginal}
                className="w-48 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get Original State
              </button>
              <button
                onClick={handleGetNew}
                className="w-48 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get New State
              </button>
            </div>

            <br />

            <div className="flex space-x-4">
              <input
                type="text"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Enter new value"
                className="flex-grow py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
              <button
                onClick={handleAddEntry}
                className="py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Entry
              </button>
            </div>

            <br />

            <select
              id="entriesDropdown"
              className="overflow-auto w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {entries.map((entry, index) => (
                <option key={index} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
