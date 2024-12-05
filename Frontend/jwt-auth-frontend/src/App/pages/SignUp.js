import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

// Password validation function using the same regex as backend
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?])(?=.{8,})/;
    return passwordRegex.test(password);
};

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');  // Store password error message
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setPasswordError(''); // Reset password error
        setLoading(true);  // Show loading indicator

        // Validate password
        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            setLoading(false);  // Hide loading indicator
            return;
        }

        try {
            // Prepare user data for registration
            const userData = {
                firstName,
                lastName,
                username,
                email,
                password,
                userType: 2,  // Default userType as 2 (since it's not displayed on the UI)
            };

            // Make API call to register the user
            const response = await api.post('/user/register', userData);

            // Redirect user to login page after successful registration
            alert('Registration successful! Please login to continue.');
            navigate('/login'); // Redirect to login page
        } catch (err) {
            setError('Failed to register. Please try again.');
        } finally {
            setLoading(false);  // Hide loading indicator
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Sign Up for Cred</h2>
                <form onSubmit={handleSignUp}>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        className="login-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    {passwordError && (
                        <p className="error-message">{passwordError}</p>
                    )}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p>Already have an account? <span className="link" onClick={() => navigate('/login')}>Login here</span></p>
            </div>
        </div>
    );
};

export default SignUp;
