// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('user'); // Checa se usuário está logado

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;