import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Redirect } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to load data.');
      }
    };

    fetchData();
  }, [token]);

  if (!token) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {data ? (
        <div>
          <h3>Welcome, {data.user.name}</h3>
          <p>Your Role: {data.user.role}</p>
          <p>Other data: {data.other}</p>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Dashboard;
