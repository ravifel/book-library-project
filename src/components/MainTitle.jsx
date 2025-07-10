import React from 'react';

const MainTitle = ({ children }) => {
    return (
        <h1
            className="mb-4 text-center"
            style={{ color: "var(--primary)", fontWeight: "bold" }}
        >
            {children}
        </h1>
    );
};

export default MainTitle;