import React from "react";

const InformationEditingModal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.4)", zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default InformationEditingModal;