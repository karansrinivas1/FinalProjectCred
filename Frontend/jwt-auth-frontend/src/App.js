import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './App/HOME/HomePage';
import Profile from './App/Profile/Profile';
import Cards from './App/Cards/CreditCardManager';
import BillPayment from './App/BILLPAYMENT/BillPayment';
import ChatAi from './App/QuickChat/ChatAi';
import Login from './App/pages/Login';

import AdminUserList from './App/ADMIN/AdminUserList';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import SignUp from './App/pages/SignUp';
import ForgotPassword from './App/pages/ForgotPassword';
import ResetPassword  from './App/pages/ResetPassword';

function App() {
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return Boolean(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const { user } = useSelector((state) => state.user);

    console.log('App.js - Logged-in User:', user);

    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/reset-password/:token" element={<ResetPassword/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
               
              

                {/* Protected Routes under MainLayout */}
                <Route element={<MainLayout onLogout={handleLogout} />}>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/cards"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Cards />
                            </ProtectedRoute>    
                           
                        }
                    />
                    <Route
                        path="/billpayment"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <BillPayment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ChatAi"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <ChatAi />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin-Specific Routes */}
                   
                    <Route
                        path="/admin/user"
                        element={
                            <RoleBasedRoute allowedRoles={[1]}>
                                <AdminUserList />
                            </RoleBasedRoute>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
