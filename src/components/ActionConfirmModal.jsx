import React from "react";

const ActionConfirmModal = ({
    show,
    title = "Confirm action",
    message = "Are you sure?",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel
}) => {
    if (!show) return null;
    return (
        <div
            className="modal fade show"
            style={{
                display: "block",
                background: "rgba(0,0,0,0.4)",
                zIndex: 1050
            }}
            tabIndex={-1}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            {cancelLabel}
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionConfirmModal;