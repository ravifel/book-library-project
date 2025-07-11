import React, { useEffect, useState } from 'react';
import MainTitle from '../components/MainTitle';

const statusColors = {
    "Aguardando pagamento": "warning",
    "Pago": "success",
    "Enviado": "info",
    "Entregue": "primary",
    "Cancelado": "danger"
};

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
            <MainTitle>Meus Pedidos</MainTitle>
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" style={{ color: "var(--primary)" }} />
                </div>
            ) : (
                <div className="row">
                    {orders.length === 0 ? (
                        <div className="text-center py-3">
                            <p>Você ainda não possui pedidos realizados.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div className="col-12 col-md-6 col-lg-4 mb-4" key={order.id}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold">Pedido #{order.id}</span>
                                            <span className={`badge bg-${statusColors[order.status] || "secondary"}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="mb-2" style={{ fontSize: 14, color: "#888" }}>
                                            {new Date(order.createdAt).toLocaleString()}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Entrega:</strong> <span>{order.address}</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Pagamento:</strong> <span>{order.paymentMethod}</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Produtos:</strong>
                                            <ul className="list-group list-group-flush">
                                                {order.items.map(item => (
                                                    <li className="list-group-item px-0 py-1" key={item.productId}>
                                                        Produto #{item.productId} &middot; Qtde: <strong>{item.quantity}</strong>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mt-auto">
                                            <strong>Total:</strong> R$ {order.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;