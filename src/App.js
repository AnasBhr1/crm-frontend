import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginForm from './components/auth/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/employer/Dashboard';
import ManagerList from './components/employer/ManagerList';
import LeadList from './components/employer/LeadList';
import ManagerLeads from './components/manager/ManagerLeads';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        {/* Employer Routes */}
        <Route path="employer/dashboard" element={
          <PrivateRoute requiredRole="employer">
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="employer/managers" element={
          <PrivateRoute requiredRole="employer">
            <ManagerList />
          </PrivateRoute>
        } />
        <Route path="employer/leads" element={
          <PrivateRoute requiredRole="employer">
            <LeadList />
          </PrivateRoute>
        } />
        
        {/* Manager Routes */}
        <Route path="manager/leads" element={
          <PrivateRoute requiredRole="manager">
            <ManagerLeads />
          </PrivateRoute>
        } />
        
        {/* Default Route */}
        <Route path="/" element={
          <Navigate to={user?.role === 'employer' ? '/employer/dashboard' : '/manager/leads'} replace />
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;