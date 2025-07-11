import React, { useState, useEffect } from 'react';
import { useCart } from '../components/CartContext';
import MainTitle from '../components/MainTitle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const DEFAULT_PIX_KEY = "pix-company@example.com";
const JUROS_PARCELADO = 0.02; // 2% monthly interest from the 11th installment

// Simple function to generate Pix payload
function gerarPayloadPix({ chave, valor, nome = "Example Store", cidade = "SAO PAULO" }) {
    const valorStr = valor.toFixed(2).replace('.', '');
    let payload = `00020126420014BR.GOV.BCB.PIX01${chave.length.toString().padStart(2, "0")}${chave}`;
    payload += `520400005303986540${valorStr}5802BR5913${nome.slice(0, 13)}6009${cidade.slice(0, 9)}62070503***6304`;
    return payload;
}

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Load user from localStorage and fetch complete data from JSON server
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser) return;
        axios.get(`http://localhost:5000/users?email=${loggedUser.email}`)
            .then(res => setUser(res.data[0]))
            .catch(() => setUser(null));
    }, []);

    // Delivery address
    const [address, setAddress] = useState('');
    const [editAddress, setEditAddress] = useState(false);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState('Pix');
    const [cardType, setCardType] = useState('Credit');
    const [parcelas, setParcelas] = useState(1);
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [pixCopied, setPixCopied] = useState(false);

    // UI Status
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    // Set address from user data
    useEffect(() => {
        if (user && user.address) setAddress(user.address);
    }, [user]);

    // Total cart value
    const getTotal = () =>
        cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    // Installment calculation
    const getParcelado = () => {
        const total = getTotal();
        if (parcelas <= 10) return { total, parcela: total / parcelas, juros: 0 };
        const jurosTotal = total * Math.pow(1 + JUROS_PARCELADO, parcelas - 10);
        return {
            total: jurosTotal,
            parcela: jurosTotal / parcelas,
            juros: jurosTotal - total
        };
    };

    // Submit order
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!address) {
            setError('Please provide a delivery address.');
            return;
        }
        if (paymentMethod === "Card") {
            if (
                !cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv ||
                (cardType === "Installments" && (parcelas < 1 || parcelas > 12))
            ) {
                setError("Please correctly fill in the card information.");
                return;
            }
        }
        setProcessing(true);
        try {
            const order = {
                userId: user?.id,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity || 1,
                    price: item.price
                })),
                address,
                paymentMethod,
                status: 'Awaiting payment confirmation',
                createdAt: new Date().toISOString(),
                paymentDetails: paymentMethod === "Card"
                    ? { cardType, parcelas, ...cardData }
                    : { pix: true }
            };
            await axios.post('http://localhost:5000/orders', order);
            clearCart();
            setTimeout(() => navigate('/order-confirmation'), 1700);
        } catch {
            setError('Error processing the order. Please try again.');
        }
        setProcessing(false);
    };

    const handleCopyPix = () => {
        navigator.clipboard.writeText(user?.pixKey || DEFAULT_PIX_KEY);
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 1200);
    };

    // Pix QR code
    const valor = getTotal();
    const chavePix = user?.pixKey || DEFAULT_PIX_KEY;
    const payloadPix = gerarPayloadPix({
        chave: chavePix,
        valor,
        nome: user?.name || "Example Store",
        cidade: "SAO PAULO"
    });

    if (!user) {
        return (
            <div className="container py-5 text-center">
                <MainTitle>Checkout</MainTitle>
                <div className="py-5">
                    <div className="spinner-border" role="status" style={{ color: "var(--primary)" }} />
                    <div className="mt-3">Loading user...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <MainTitle>Checkout</MainTitle>

            {/* Delivery address */}
            <div className="mb-4">
                <strong>Delivery Address:</strong><br />
                {editAddress ? (
                    <div className="d-flex gap-2 align-items-center">
                        <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            style={{ maxWidth: 350 }}
                            required
                        />
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditAddress(false)}>Save</button>
                    </div>
                ) : (
                    <div className="d-flex gap-2 align-items-center">
                        <span>{address}</span>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setEditAddress(true)}>Edit</button>
                    </div>
                )}
            </div>

            {/* Product summary */}
            <div className="mb-4">
                <h5>Order Summary</h5>
                <ul>
                    {cart.map(item => (
                        <li key={item.id}>
                            {item.nameProduct || item.nameBook} x {item.quantity || 1} — ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <h5>Total: <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                    ${getTotal().toFixed(2)}
                </span></h5>
            </div>

            {/* Payment */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                        <option value="Pix">Pix</option>
                        <option value="Card">Card</option>
                    </select>
                </div>

                {/* Card details */}
                {paymentMethod === "Card" && (
                    <>
                        <div className="mb-2">
                            <label className="form-label me-2">Type:</label>
                            <select className="form-select d-inline w-auto" value={cardType} onChange={e => setCardType(e.target.value)}>
                                <option value="Credit">Credit</option>
                                <option value="Debit">Debit</option>
                                <option value="Installments">Installments</option>
                            </select>
                        </div>
                        {cardType === "Installments" && (
                            <div className="mb-2">
                                <label htmlFor="parcelas" className="form-label me-2">Installments:</label>
                                <select
                                    id="parcelas"
                                    className="form-select d-inline w-auto"
                                    value={parcelas}
                                    onChange={e => setParcelas(Number(e.target.value))}
                                >
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}x</option>
                                    ))}
                                </select>
                                {parcelas > 10 && (
                                    <span className="ms-2 text-danger" style={{ fontSize: 14 }}>
                                        2% monthly interest applied
                                    </span>
                                )}
                                <div className="mt-1">
                                    <span>
                                        Installment value: <b>${getParcelado().parcela.toFixed(2)}</b> <br />
                                        Total: <b>${getParcelado().total.toFixed(2)}</b>
                                    </span>
                                </div>
                            </div>
                        )}
                        {/* Card info */}
                        <div className="mb-2">
                            <input className="form-control mb-2"
                                type="text" placeholder="Card number" maxLength={19}
                                value={cardData.number}
                                onChange={e => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })}
                                required />
                            <input className="form-control mb-2"
                                type="text" placeholder="Expiry (MM/YY)"
                                value={cardData.expiry}
                                onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                                required />
                            <input className="form-control mb-2"
                                type="text" placeholder="CVV"
                                value={cardData.cvv}
                                onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                required />
                            <input className="form-control mb-2"
                                type="text" placeholder="Cardholder name"
                                value={cardData.name}
                                onChange={e => setCardData({ ...cardData, name: e.target.value })}
                                required />
                        </div>
                    </>
                )}

                {/* Pix section */}
                {paymentMethod === "Pix" && (
                    <div className="mb-4 text-center">
                        <div>
                            <QRCodeSVG value={payloadPix} size={180} />
                            <div className="text-muted" style={{ fontSize: 13 }}>Point your bank app camera</div>
                        </div>
                        <div className="mt-2 d-flex justify-content-center align-items-center gap-2">
                            <b>Pix Key:</b>
                            <span style={{
                                userSelect: "all",
                                fontWeight: 500,
                                color: "#1976d2"
                            }}>{chavePix}</span>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handleCopyPix}
                            >
                                {pixCopied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <div className="mt-2">
                            <button
                                type="button"
                                className="btn btn-light btn-sm"
                                onClick={() => { navigator.clipboard.writeText(payloadPix); }}
                            >
                                Copy Pix code
                            </button>
                        </div>
                        <div className="alert alert-info py-2 my-2" style={{ fontSize: 14 }}>
                            Make the Pix payment and click "Place Order". Your payment will be reviewed.
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={processing}>
                    {processing ? 'Processing...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
