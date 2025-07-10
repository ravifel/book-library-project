import React from "react";

const QuantitySelector = ({
    value,
    onDecrease,
    onIncrease,
    onChange,
    min = 1,
    max = 100,
    inputWidth = 48
}) => (
    <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6
    }}>
        <button
            type="button"
            className="btn btn-light"
            style={{
                border: "1.5px solid var(--primary-card)",
                borderRadius: "6px",
                fontWeight: "bold",
                width: 28,
                height: 28,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            onClick={onDecrease}
            disabled={value <= min}
            aria-label="Decrease quantity"
        >-</button>
        <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={e => {
                let v = parseInt(e.target.value, 10);
                if (isNaN(v)) v = min;
                if (v < min) v = min;
                if (v > max) v = max;
                onChange(v);
            }}
            style={{
                width: inputWidth,
                textAlign: "center",
                border: "1.5px solid var(--primary-card)",
                borderRadius: "6px",
                height: 28,
                color: "var(--primary)",
                background: "var(--secondary-light)",
                margin: "0 2px"
            }}
        />
        <button
            type="button"
            className="btn btn-light"
            style={{
                border: "1.5px solid var(--primary-card)",
                borderRadius: "6px",
                fontWeight: "bold",
                width: 28,
                height: 28,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            onClick={onIncrease}
            disabled={value >= max}
            aria-label="Increase quantity"
        >+</button>
    </div>
);

export default QuantitySelector;