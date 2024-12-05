// src/pages/Dashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token
        }
    }, [navigate]);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to the protected dashboard!</p>
        </div>
    );
};

export default Dashboard;
