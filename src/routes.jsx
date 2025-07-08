// routes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Favorites from './pages/Favorites';
import Category from './pages/Category';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';
import PrivateLayout from './components/PrivateLayout';
import Cart from './pages/Cart';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Rotas protegidas com layout privado */}
                <Route path="/home" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <Home />
                        </PrivateLayout>
                    </ProtectedRoute>
                } />

                <Route path="/favorites" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <Favorites />
                        </PrivateLayout>
                    </ProtectedRoute>
                } />

                <Route path="/cart" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <Cart />
                        </PrivateLayout>
                    </ProtectedRoute>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <Profile />
                        </PrivateLayout>
                    </ProtectedRoute>
                } />

                <Route path="/category/:name" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <Category />
                        </PrivateLayout>
                    </ProtectedRoute>
                } />

                <Route path="/book/:id" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <BookDetails />
                        </PrivateLayout>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
