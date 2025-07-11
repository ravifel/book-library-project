import React from 'react';
import MainTitle from '../components/MainTitle';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
    return (
        <div className="container py-5 text-center">
            <MainTitle>Pedido realizado com sucesso!</MainTitle>
            <p className="mt-3 mb-4" style={{ fontSize: "1.1rem" }}>
                Seu pedido foi recebido. Em breve você poderá acompanhar o status da entrega.
            </p>
            <Link to="/orders" className="btn btn-primary">
                Ver Meus Pedidos
            </Link>
            <div className="mt-4">
                <Link to="/home" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                    Voltar para a Loja
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;