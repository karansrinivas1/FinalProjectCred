import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { user } = useSelector((state) => state.user);

    // Debugging logs
    console.log('RoleBasedRoute - Current User:', user);
    console.log('RoleBasedRoute - Allowed Roles:', allowedRoles);

    // If no user is logged in, redirect to login
    if (!user) {
        console.log('No user logged in. Redirecting to /login.');
        return <Navigate to="/login" />;
    }

    // Check if the user's type matches allowed roles
    if (allowedRoles.includes(user.type)) {
        console.log('User is authorized. Rendering child components.');
        return children; // Render the child components if the user is authorized
    }

    console.log(`User type ${user.type} not authorized. Redirecting to /`);
    return <div>You are not authorized to view this page.</div>;
};

export default RoleBasedRoute;
