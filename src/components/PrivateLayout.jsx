import React from 'react';
import Navbar from './Navbar';

const PrivateLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="container mt-4">
                {children}
            </div>
        </>
    );
};

export default PrivateLayout;
