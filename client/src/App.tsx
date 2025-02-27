import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import AppContent from './content/MainApp';
import LoginContent from './content/Login';
import SketchupConsoleContent from './content/SketchupConsole';
import StorageLayout from './components/storage/StorageLayout';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/login" element={<LoginContent />} />
            {/* <Route path="/cad3" element={<Cad3Viewer data={testfileData} />} /> */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/storage"
              element={
                <ProtectedRoute>
                  <StorageLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sketchupConsole"
              element={
                <ProtectedRoute>
                  <SketchupConsoleContent />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;