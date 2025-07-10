import React from "react";

const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [5, 10, 20, 50, 100]
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div
            className="d-flex align-items-center justify-content-end"
            style={{
                gap: 20,
                padding: "18px 0 10px 0",
                fontSize: 15,
                flexWrap: "wrap"
            }}
        >
            <span>Resultados por página</span>
            <select
                value={itemsPerPage}
                onChange={e => onItemsPerPageChange(Number(e.target.value))}
                style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 15,
                    outline: "none",
                    cursor: "pointer"
                }}
            >
                {itemsPerPageOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <span>
                {start}-{end} de {totalItems}
            </span>
            <button
                className="pagination-arrow"
                aria-label="Página anterior"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 20,
                    color: currentPage === 1 ? "#b0b8c1" : "#222",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    padding: "0 6px"
                }}
            >
                &#x2039;
            </button>
            <button
                className="pagination-arrow"
                aria-label="Próxima página"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalItems === 0}
                style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 20,
                    color: (currentPage === totalPages || totalItems === 0) ? "#b0b8c1" : "#222",
                    cursor: (currentPage === totalPages || totalItems === 0) ? "not-allowed" : "pointer",
                    padding: "0 6px"
                }}
            >
                &#x203A;
            </button>
        </div>
    );
};

export default Pagination;