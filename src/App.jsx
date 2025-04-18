import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Employer pages
import EmployerDashboard from './pages/employer/Dashboard';
import EmployerManagers from './pages/employer/Managers';
import EmployerLeads from './pages/employer/Leads';

// Manager pages
import ManagerLeads from './pages/manager/Leads';

// Layout
import Layout from './components/Layout';

// Context providers
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Employer Routes */}
          <Route 
            path="/employer/*" 
            element={
              <ProtectedRoute allowedRole="employer">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<EmployerDashboard />} />
                    <Route path="managers" element={<EmployerManagers />} />
                    <Route path="leads" element={<EmployerLeads />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Protected Manager Routes */}
          <Route 
            path="/manager/*" 
            element={
              <ProtectedRoute allowedRole="manager">
                <Layout>
                  <Routes>
                    <Route path="leads" element={<ManagerLeads />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Redirect to login by default */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;