import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Container, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';

const MainLayout = ({ onLogout }) => {
    const location = useLocation();
    const { user } = useSelector((state) => state.user);
    console.log('Logged-in user:', user);

    return (
        <>
            <CssBaseline />
            {location.pathname !== '/login' && <Navbar onLogout={onLogout} />}
            <Container>
                {/* Conditionally render admin-specific links */}
                {user?.type === 'admin' && (
                    <div style={{ margin: '20px 0' }}>
                        <a href="/admin/add-job" style={{ marginRight: 20 }}>
                            Add Job
                        </a>
                        <a href="/admin/employees">Employee List</a>
                    </div>
                )}

                {/* Conditionally render employee-specific content */}
                {user?.type === 'employee' && (
                    <div style={{ margin: '20px 0' }}>
                        <p>Welcome, {user.name}! You have employee access.</p>
                    </div>
                )}

                <Outlet />
            </Container>
        </>
    );
};

export default MainLayout;
