import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../components/CartContext';
import MainTitle from '../components/MainTitle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { calculateShippingByZipcode } from '../utils/shippingStates';

const DEFAULT_PIX_KEY = "pix-company@example.com";
const INSTALLMENT_INTEREST = 0.02; // 2% monthly interest from the 11th installment

const emptyAddress = {
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
};

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [address, setAddress] = useState(emptyAddress);
    const [shipping, setShipping] = useState(0);
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Pix');
    const [cardType, setCardType] = useState('Credit');
    const [installments, setInstallments] = useState(1);
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [pixCopied, setPixCopied] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [cepError, setCepError] = useState('');

    // Track the last cep searched/fetched
    const lastFetchedCep = useRef('');

    // Load user from localStorage and fetch complete data from JSON server
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser) return;
        axios.get(`http://localhost:5000/users?email=${loggedUser.email}`)
            .then(res => {
                const userFromDb = res.data[0];
                setUser(userFromDb);

                // Always use backend address!
                let addr = typeof userFromDb.address === 'string' ? emptyAddress : userFromDb.address;
                setAddress(addr);

                setDeliveryInstructions(userFromDb.deliveryInstructions || '');
            })
            .catch(() => setUser(null));
    }, []);

    // Set address and zip code from user data if available
    useEffect(() => {
        if (user && user.address) {
            let addr = typeof user.address === 'string' ? emptyAddress : user.address;
            setAddress(addr);

            if (user.deliveryInstructions) setDeliveryInstructions(user.deliveryInstructions);

            const zip = addr.zipCode || '';
            if (zip) setShipping(calculateShippingByZipcode(zip));
        }
    }, [user]);

    // Function to clear address fields except zip code
    const clearAddressFields = (cepValue) => ({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: cepValue || ''
    });

    // Detect when user finishes typing a valid zip code (8 digits)
    useEffect(() => {
        const cepOnlyNumbers = address.zipCode?.replace(/\D/g, '');

        // If the field was cleared or is incomplete, clear the error
        if (!cepOnlyNumbers || cepOnlyNumbers.length === 0) {
            setCepError('');
            return;
        }
        // If the user is typing but hasn't completed 8 digits
        if (cepOnlyNumbers.length > 0 && cepOnlyNumbers.length < 8) {
            setCepError('Zip code must have 8 digits.');
            return;
        }

        // Only do something if the zip code is valid (8 digits) and different from the last fetched
        if (
            cepOnlyNumbers &&
            cepOnlyNumbers.length === 8 &&
            cepOnlyNumbers !== lastFetchedCep.current
        ) {
            setCepError('');
            // Clear fields (except zip code)
            setAddress(prev => clearAddressFields(prev.zipCode));

            // Wait for clearing (to ensure React updates state before fetching!)
            setTimeout(() => {
                axios.get(`https://viacep.com.br/ws/${cepOnlyNumbers}/json/`)
                    .then(response => {
                        if (!response.data.erro) {
                            setAddress(prev => ({
                                ...prev,
                                street: response.data.logradouro || '',
                                neighborhood: response.data.bairro || '',
                                city: response.data.localidade || '',
                                state: response.data.uf || '',
                            }));
                            setCepError('');
                        } else {
                            setCepError('Zip code not found.');
                        }
                        // Register the zip code to avoid unnecessary new fetches
                        lastFetchedCep.current = cepOnlyNumbers;
                    })
                    .catch(() => setCepError('Error while fetching zip code.'));
            }, 0);
        }
    }, [address.zipCode]);

    // Update shipping cost when the user types a new zip code
    useEffect(() => {
        if (address.zipCode && address.zipCode.length >= 2)
            setShipping(calculateShippingByZipcode(address.zipCode));
    }, [address.zipCode]);

    // Calculate total cart value
    const getTotal = () =>
        cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    // Calculate installment values (with interest above 10x)
    const getInstallmentInfo = () => {
        const total = getTotal() + shipping;
        if (installments <= 10) return { total, installment: total / installments, interest: 0 };
        const totalWithInterest = total * Math.pow(1 + INSTALLMENT_INTEREST, installments - 10);
        return {
            total: totalWithInterest,
            installment: totalWithInterest / installments,
            interest: totalWithInterest - total
        };
    };

    // Handle address input change
    const handleAddressChange = e => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: name === "zipCode"
                ? value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9)
                : value
        }));
        // If user is typing a new zip code, reset lastFetchedCep to guarantee future fetch
        if (name === 'zipCode') {
            lastFetchedCep.current = '';
        }
    };

    // Handle order submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Basic address validation
        if (!address.street || !address.number || !address.city || !address.state || !address.zipCode) {
            setError('Please fill out the full delivery address.');
            return;
        }
        if (!address.zipCode) {
            setError('Please provide the zip code.');
            return;
        }
        if (paymentMethod === "Card") {
            if (
                !cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv ||
                (cardType === "Installments" && (installments < 1 || installments > 12))
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
                deliveryInstructions,
                paymentMethod,
                shipping,
                status: 'Awaiting payment confirmation',
                createdAt: new Date().toISOString(),
                paymentDetails: paymentMethod === "Card"
                    ? { cardType, installments, ...cardData }
                    : { pix: true }
            };
            await axios.post('http://localhost:5000/orders', order);

            // Update user address and delivery instructions in db.json
            await axios.patch(`http://localhost:5000/users/${user.id}`, {
                address,
                deliveryInstructions
            });

            clearCart();
            setTimeout(() => navigate('/order-confirmation'), 1700);
        } catch {
            setError('Error processing the order. Please try again.');
        }
        setProcessing(false);
    };

    // Copy Pix key to clipboard
    const handleCopyPix = () => {
        navigator.clipboard.writeText(user?.pixKey || DEFAULT_PIX_KEY);
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 1200);
    };

    // Generate Pix QR code
    const amount = getTotal() + shipping;
    const pixKey = user?.pixKey || DEFAULT_PIX_KEY;
    const pixPayload = (() => {
        const amountStr = amount.toFixed(2).replace('.', '');
        let payload = `00020126420014BR.GOV.BCB.PIX01${pixKey.length.toString().padStart(2, "0")}${pixKey}`;
        payload += `520400005303986540${amountStr}5802BR5913${(user?.name || "Example Store").slice(0, 13)}6009SAO PAULO62070503***6304`;
        return payload;
    })();

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

            {/* Address form */}
            <form className="mb-4 p-3 border rounded" autoComplete="off">
                <div className="row mb-2">
                    <div className="col-md-8">
                        <label className="form-label">Street</label>
                        <input type="text" className="form-control" name="street" value={address.street}
                            onChange={handleAddressChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Number</label>
                        <input type="text" className="form-control" name="number" value={address.number}
                            onChange={handleAddressChange} required />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-md-6">
                        <label className="form-label">Neighborhood</label>
                        <input type="text" className="form-control" name="neighborhood" value={address.neighborhood}
                            onChange={handleAddressChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">City</label>
                        <input type="text" className="form-control" name="city" value={address.city}
                            onChange={handleAddressChange} required />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">State</label>
                        <input type="text" className="form-control" name="state" value={address.state}
                            onChange={handleAddressChange} required maxLength={2} />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-md-6">
                        <label className="form-label">Zip Code</label>
                        <input type="text" className="form-control" name="zipCode"
                            value={address.zipCode}
                            onChange={handleAddressChange}
                            placeholder="00000-000"
                            maxLength={9}
                            required
                        />
                        {cepError && <div className="text-danger">{cepError}</div>}
                        {shipping > 0 && (
                            <span className="text-success">
                                Shipping: <b>R$ {shipping.toFixed(2)}</b>
                            </span>
                        )}
                    </div>
                </div>
                <div className="mb-2">
                    <label className="form-label">Delivery instructions:</label>
                    <textarea
                        className="form-control"
                        value={deliveryInstructions}
                        onChange={e => setDeliveryInstructions(e.target.value)}
                        placeholder="Example: Leave at the gate, ring the intercom, etc."
                        rows={2}
                    />
                </div>
            </form>

            {/* Product summary */}
            <div className="mb-4">
                <h5>Order Summary</h5>
                <ul>
                    {cart.map(item => (
                        <li key={item.id}>
                            {item.nameProduct || item.nameBook} x {item.quantity || 1} — R$ {(item.price * (item.quantity || 1)).toFixed(2)}
                        </li>
                    ))}
                    {shipping > 0 && (
                        <li>
                            <b>Shipping:</b> R$ {shipping.toFixed(2)}
                        </li>
                    )}
                </ul>
                <h5>Total: <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                    R$ {(getTotal() + shipping).toFixed(2)}
                </span></h5>
            </div>

            {/* Payment section */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                        <option value="Pix">Pix</option>
                        <option value="Card">Card</option>
                    </select>
                </div>

                {/* Card payment details */}
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
                                <label htmlFor="installments" className="form-label me-2">Installments:</label>
                                <select
                                    id="installments"
                                    className="form-select d-inline w-auto"
                                    value={installments}
                                    onChange={e => setInstallments(Number(e.target.value))}
                                >
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}x</option>
                                    ))}
                                </select>
                                {installments > 10 && (
                                    <span className="ms-2 text-danger" style={{ fontSize: 14 }}>
                                        2% monthly interest applied
                                    </span>
                                )}
                                <div className="mt-1">
                                    <span>
                                        Installment value: <b>R$ {getInstallmentInfo().installment.toFixed(2)}</b> <br />
                                        Total: <b>R$ {getInstallmentInfo().total.toFixed(2)}</b>
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

                {/* Pix payment section */}
                {paymentMethod === "Pix" && (
                    <div className="mb-4 text-center">
                        <div>
                            <QRCodeSVG value={pixPayload} size={180} />
                            <div className="text-muted" style={{ fontSize: 13 }}>Point your bank app camera</div>
                        </div>
                        <div className="mt-2 d-flex justify-content-center align-items-center gap-2">
                            <b>Pix Key:</b>
                            <span style={{
                                userSelect: "all",
                                fontWeight: 500,
                                color: "#1976d2"
                            }}>{pixKey}</span>
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
                                onClick={() => { navigator.clipboard.writeText(pixPayload); }}
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