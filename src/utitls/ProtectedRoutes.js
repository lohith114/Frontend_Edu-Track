import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element, isAuthenticated }) {
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/Edu-Track" />;
    }

    return element;
}

export default ProtectedRoute;
