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

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/home" element={<Home />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/category/:name" element={<Category />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;