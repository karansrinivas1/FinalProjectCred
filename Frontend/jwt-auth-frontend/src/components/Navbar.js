import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();

    // Access user data from Redux
    const { user } = useSelector((state) => state.user);

    const handleLogout = () => {
        onLogout(); // This function will remove the JWT token from localStorage
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Cred
                </Typography>

                {/* Render links based on user type */}
                {user?.type === 1 ? (
                    // Admin-specific links
                    <>
                        <Button color="inherit" component={Link} to="/admin/user">UserList</Button>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/cards">Cards</Button>
                        <Button color="inherit" component={Link} to="/billpayment">BillPayment</Button>
                        <Button color="inherit" component={Link} to="/ChatAi">QuikChat</Button>
                        <Button color="inherit" component={Link} to="/profile">Profile</Button>
                    </>
                ) : user?.type === 2? (
                    // Employee-specific links
                    <>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/cards">Cards</Button>
                        <Button color="inherit" component={Link} to="/billpayment">BillPayment</Button>
                        <Button color="inherit" component={Link} to="/ChatAi">QuikChat</Button>
                        <Button color="inherit" component={Link} to="/profile">Profile</Button>
                    </>
                ) : (
                    // Links for unauthenticated users
                    <>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/profile">Profile</Button>
                        <Button color="inherit" component={Link} to="/billpayment">BillPayment</Button>
                        <Button color="inherit" component={Link} to="/chatAi">Chat</Button>
                    </>
                )}

                {/* Logout Button */}
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
