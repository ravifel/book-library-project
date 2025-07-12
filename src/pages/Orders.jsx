import React, { useEffect, useState } from 'react';
import MainTitle from '../components/MainTitle';
import OrderCard from '../components/OrderCard';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await fetch(`http://localhost:5000/orders?userId=${user.id}`);
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setOrders([]);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    return (
        <div className="container py-5">
            <MainTitle>My orders</MainTitle>
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" style={{ color: "var(--primary)" }} />
                </div>
            ) : (
                <div className="row">
                    {orders.length === 0 ? (
                        <div className="text-center py-3">
                            <p>You have not placed any orders yet.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div className="col-12 col-md-6 col-lg-4 mb-4" key={order.id}>
                                <OrderCard order={order} />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;