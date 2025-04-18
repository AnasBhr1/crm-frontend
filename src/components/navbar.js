import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">CRM System</h1>
          {user && (
            <div className="hidden md:flex space-x-4">
              {user.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="hover:text-blue-200">Dashboard</Link>
                  <Link to="/employer/managers" className="hover:text-blue-200">Managers</Link>
                  <Link to="/employer/leads" className="hover:text-blue-200">Leads</Link>
                </>
              )}
              {user.role === 'manager' && (
                <Link to="/manager/leads" className="hover:text-blue-200">My Leads</Link>
              )}
            </div>
          )}
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;