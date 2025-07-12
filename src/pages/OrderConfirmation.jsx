import React from 'react';
import MainTitle from '../components/MainTitle';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
    return (
        <div className="container py-5 text-center">
            <MainTitle>Order placed successfully!</MainTitle>
            <p className="mt-3 mb-4" style={{ fontSize: "1.1rem" }}>
                Your order has been received. Soon you will be able to track the delivery status.
            </p>
            <Link to="/orders" className="btn btn-primary">
                View my orders
            </Link>
            <div className="mt-4">
                <Link to="/home" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                    Back to Store
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;