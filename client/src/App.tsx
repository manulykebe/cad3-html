import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

import AppContent from './content/MainApp';
import LoginContent from './content/Login';
import SketchupConsoleContent from './content/SketchupConsole';
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
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppContent />
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
