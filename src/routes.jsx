import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Favorites from './pages/Favorites';
import Category from './pages/Category';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';
import PrivateLayout from './components/PrivateLayout';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected routes with private layout */}
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

                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <Checkout />
                        </PrivateLayout>
                    </ProtectedRoute>
                } />

                <Route path="/order-confirmation" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <OrderConfirmation />
                        </PrivateLayout>
                    </ProtectedRoute>
                } />

                <Route path="/orders" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <Orders />
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

                <Route path="/product/:id" element={
                    <ProtectedRoute>
                        <PrivateLayout>
                            <ProductDetails />
                        </PrivateLayout>
                    </ProtectedRoute>
                } />

                {/* 404 Not Found route */}
                <Route path="*" element={
                    <NotFound />
                } />

                <Route path="/reset-password" element={
                    <ResetPassword />
                } />
            </Routes>
        </Router>
    );
};

export default AppRoutes;