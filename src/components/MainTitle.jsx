import React from 'react';

const MainTitle = ({ children }) => {
    return (
        <h1
            className="mb-4 text-center mt-4"
            style={{ color: "var(--primary)", fontWeight: "bold" }}
        >
            {children}
        </h1>
    );
};

export default MainTitle;