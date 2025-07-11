import React, { useState, useEffect } from 'react';
import { useCart } from '../components/CartContext';
import MainTitle from '../components/MainTitle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const DEFAULT_PIX_KEY = "pix-empresa@exemplo.com";
const JUROS_PARCELADO = 0.02; // 2% a.m. a partir da 11ª parcela

// Função simples para gerar payload Pix (exemplo educativo, para produção use gerador oficial)
function gerarPayloadPix({ chave, valor, nome = "Loja Exemplo", cidade = "SAO PAULO" }) {
    // Payload Pix simples para QR Code (não serve para produção bancária real)
    // Para produção, use um gerador Pix Copia e Cola certificado!
    const valorStr = valor.toFixed(2).replace('.', '');
    let payload = `00020126420014BR.GOV.BCB.PIX01${chave.length.toString().padStart(2, "0")}${chave}`;
    payload += `520400005303986540${valorStr}5802BR5913${nome.slice(0, 13)}6009${cidade.slice(0, 9)}62070503***6304`;
    return payload;
}

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();

    // Estado para dados do usuário
    const [user, setUser] = useState(null);

    // Carregar usuário do localStorage e buscar dados completos do JSON server
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser) return;
        axios.get(`http://localhost:5000/users?email=${loggedUser.email}`)
            .then(res => setUser(res.data[0]))
            .catch(() => setUser(null));
    }, []);

    // Endereço de entrega
    const [address, setAddress] = useState('');
    const [editAddress, setEditAddress] = useState(false);

    // Pagamento
    const [paymentMethod, setPaymentMethod] = useState('Pix');
    const [cardType, setCardType] = useState('Crédito');
    const [parcelas, setParcelas] = useState(1);
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [pixCopied, setPixCopied] = useState(false);

    // Estado UI
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    // Atualiza endereço default ao carregar usuário
    useEffect(() => {
        if (user && user.address) setAddress(user.address);
    }, [user]);

    // Valor total do carrinho
    const getTotal = () =>
        cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    // Cálculo de parcelamento
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

    // Submissão do pedido
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!address) {
            setError('Por favor, informe um endereço de entrega.');
            return;
        }
        if (paymentMethod === "Cartão") {
            if (
                !cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv ||
                (cardType === "Parcelado" && (parcelas < 1 || parcelas > 12))
            ) {
                setError("Preencha corretamente os dados do cartão.");
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
                status: 'Aguardando confirmação do pagamento',
                createdAt: new Date().toISOString(),
                paymentDetails: paymentMethod === "Cartão"
                    ? { cardType, parcelas, ...cardData }
                    : { pix: true }
            };
            await axios.post('http://localhost:5000/orders', order);
            clearCart();
            setTimeout(() => navigate('/order-confirmation'), 1700);
        } catch {
            setError('Erro ao processar o pedido. Tente novamente.');
        }
        setProcessing(false);
    };

    const handleCopyPix = () => {
        navigator.clipboard.writeText(user?.pixKey || DEFAULT_PIX_KEY);
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 1200);
    };

    // Geração do payload Pix e valor
    const valor = getTotal();
    const chavePix = user?.pixKey || DEFAULT_PIX_KEY;
    const payloadPix = gerarPayloadPix({
        chave: chavePix,
        valor,
        nome: user?.name || "Loja Exemplo",
        cidade: "SAO PAULO"
    });

    if (!user) {
        return (
            <div className="container py-5 text-center">
                <MainTitle>Finalizar Pedido</MainTitle>
                <div className="py-5">
                    <div className="spinner-border" role="status" style={{ color: "var(--primary)" }} />
                    <div className="mt-3">Carregando usuário...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <MainTitle>Finalizar Pedido</MainTitle>

            {/* Endereço de entrega */}
            <div className="mb-4">
                <strong>Endereço de entrega:</strong><br />
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
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditAddress(false)}>Salvar</button>
                    </div>
                ) : (
                    <div className="d-flex gap-2 align-items-center">
                        <span>{address}</span>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setEditAddress(true)}>Alterar</button>
                    </div>
                )}
            </div>

            {/* Resumo dos Produtos */}
            <div className="mb-4">
                <h5>Resumo dos Produtos</h5>
                <ul>
                    {cart.map(item => (
                        <li key={item.id}>
                            {item.nameProduct || item.nameBook} x {item.quantity || 1} — R$ {(item.price * (item.quantity || 1)).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <h5>Total: <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                    R$ {getTotal().toFixed(2)}
                </span></h5>
            </div>

            {/* Pagamento */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Forma de Pagamento</label>
                    <select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                        <option value="Pix">Pix</option>
                        <option value="Cartão">Cartão</option>
                    </select>
                </div>

                {/* Cartão */}
                {paymentMethod === "Cartão" && (
                    <>
                        <div className="mb-2">
                            <label className="form-label me-2">Tipo:</label>
                            <select className="form-select d-inline w-auto" value={cardType} onChange={e => setCardType(e.target.value)}>
                                <option value="Crédito">Crédito</option>
                                <option value="Débito">Débito</option>
                                <option value="Parcelado">Parcelado</option>
                            </select>
                        </div>
                        {cardType === "Parcelado" && (
                            <div className="mb-2">
                                <label htmlFor="parcelas" className="form-label me-2">Parcelas:</label>
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
                                        Juros de 2% a.m. aplicados
                                    </span>
                                )}
                                <div className="mt-1">
                                    <span>
                                        Valor da parcela: <b>R$ {getParcelado().parcela.toFixed(2)}</b> <br />
                                        Total: <b>R$ {getParcelado().total.toFixed(2)}</b>
                                    </span>
                                </div>
                            </div>
                        )}
                        {/* Dados do cartão */}
                        <div className="mb-2">
                            <input className="form-control mb-2"
                                type="text" placeholder="Número do cartão" maxLength={19}
                                value={cardData.number}
                                onChange={e => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })}
                                required />
                            <input className="form-control mb-2"
                                type="text" placeholder="Validade (MM/AA)"
                                value={cardData.expiry}
                                onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                                required />
                            <input className="form-control mb-2"
                                type="text" placeholder="CVV"
                                value={cardData.cvv}
                                onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                required />
                            <input className="form-control mb-2"
                                type="text" placeholder="Nome impresso no cartão"
                                value={cardData.name}
                                onChange={e => setCardData({ ...cardData, name: e.target.value })}
                                required />
                        </div>
                    </>
                )}

                {/* Pix */}
                {paymentMethod === "Pix" && (
                    <div className="mb-4 text-center">
                        <div>
                            <QRCodeSVG value={payloadPix} size={180} />
                            <div className="text-muted" style={{ fontSize: 13 }}>Aponte a câmera do app do banco</div>
                        </div>
                        <div className="mt-2 d-flex justify-content-center align-items-center gap-2">
                            <b>Chave Pix:</b>
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
                                {pixCopied ? "Copiado!" : "Copiar"}
                            </button>
                        </div>
                        <div className="mt-2">
                            <button
                                type="button"
                                className="btn btn-light btn-sm"
                                onClick={() => { navigator.clipboard.writeText(payloadPix); }}
                            >
                                Copiar código Pix copia e cola
                            </button>
                        </div>
                        <div className="alert alert-info py-2 my-2" style={{ fontSize: 14 }}>
                            Faça o pagamento via Pix e clique em "Finalizar Pedido". O pagamento será analisado.
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={processing}>
                    {processing ? 'Processando...' : 'Finalizar Pedido'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;