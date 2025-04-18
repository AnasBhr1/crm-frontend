import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has the correct role
  if (allowedRole && user?.role !== allowedRole) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'employer') {
      return <Navigate to="/employer/dashboard" replace />;
    } else if (user?.role === 'manager') {
      return <Navigate to="/manager/leads" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;