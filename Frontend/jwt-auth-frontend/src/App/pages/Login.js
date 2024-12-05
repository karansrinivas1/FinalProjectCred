// src/pages/Login.js
import React, { useState, useEffect } from 'react'; // Added useEffect here
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Add the login-page class to body
    useEffect(() => {
        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Show loading indicator

        try {
            // Make API call to login
            const response = await api.post('/user/login', { username, password });

            // Save JWT token in localStorage
            localStorage.setItem('token', response.data.token);

            // Extract user details from response
            const { firstName, lastName, username: userUsername, email, userType } = response.data.user;

            // Dispatch user data to Redux store
            dispatch(
                setUser({
                    username: userUsername, // Store username
                    firstName, // Store first name
                    lastName, // Store last name
                    email, // Store email
                    type: userType, // Store user type
                })
            );

            // Redirect based on user role
            if (userType === 1) {
                navigate('/admin/user'); // Redirect employee to admin user place
            } else if (userType === 2) {
                navigate('/'); // Redirect to home page
            } else {
                throw new Error('Invalid user type');
            }
        } catch (err) {
            // Display error if the credentials are invalid
            setError('Invalid credentials');
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    const handleSignUp = () => {
        navigate('/signup'); // Redirect to sign-up page
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password'); // Redirect to forgot password page
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login to Cred</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <div className="additional-actions">
                    <button className="link-button" onClick={handleSignUp}>
                        Don't have an account? Sign Up
                    </button>
                    <button className="link-button" onClick={handleForgotPassword}>
                        Forgot Password?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
