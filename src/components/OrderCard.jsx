import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const statusColors = {
    "Aguardando pagamento": "warning",
    "Aguardando confirmação do pagamento": "warning",
    "Pago": "success",
    "Enviado": "info",
    "Entregue": "primary",
    "Cancelado": "danger"
};

const renderAddress = (address) => {
    if (!address) return <span className="text-muted">Not provided</span>;
    if (typeof address === "string") return <span>{address}</span>;
    return (
        <span style={{ display: 'block', wordBreak: 'break-word' }}>
            {address.street && <>{address.street}, {address.number}<br /></>}
            {address.neighborhood && <>{address.neighborhood}<br /></>}
            {address.city && address.state && (
                <>{address.city} - {address.state}, {address.zipCode}</>
            )}
        </span>
    );
};

const OrderCard = ({ order }) => (
    <div className="card h-100 shadow-sm order-card-mobile">
        <div className="card-body d-flex flex-column" style={{ minWidth: 0, padding: '1rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap order-card-header-flex">
                <span className="fw-bold" style={{ fontSize: '1.07rem', wordBreak: 'break-word' }}>Order #{order.id}</span>
                <span className={`badge bg-${statusColors[order.status] || "secondary"} order-status-badge`}>
                    {order.status}
                </span>
            </div>
            <div className="mb-2" style={{ fontSize: 13, color: "#888", wordBreak: 'break-word' }}>
                {new Date(order.createdAt).toLocaleString()}
            </div>
            <div className="mb-2">
                <strong>Delivery:</strong> {renderAddress(order.address)}
            </div>
            <div className="mb-2">
                <strong>Payment:</strong> <span>{order.paymentMethod}</span>
            </div>
            {order.deliveryInstructions && (
                <div className="mb-2">
                    <strong>Instructions:</strong> <span style={{ wordBreak: 'break-word' }}>{order.deliveryInstructions}</span>
                </div>
            )}
            <div className="mb-2">
                <strong>Products:</strong>
                <ul className="list-group list-group-flush">
                    {order.items.map(item => (
                        <li className="list-group-item px-0 py-1" key={item.productId} style={{ fontSize: 14, wordBreak: 'break-word', border: 'none', paddingLeft: 0, paddingRight: 0, background: 'inherit' }}>
                            Product #{item.productId} &middot; Qty: <strong>{item.quantity}</strong>
                            {item.price && (
                                <> &middot; ${(item.price * item.quantity).toFixed(2)}</>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                {order.shipping && (
                    <div>
                        <strong>Shipping:</strong> ${order.shipping.toFixed(2)}
                    </div>
                )}
                <div className="mt-auto" style={{ fontSize: 15 }}>
                    <strong>Total:</strong> ${(
                        order.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
                        + (order.shipping || 0)
                    ).toFixed(2)}
                </div>
            </div>
        </div>
    </div>
);

export default OrderCard;