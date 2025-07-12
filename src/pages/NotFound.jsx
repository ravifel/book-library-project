import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
    <div className="container text-center py-5">
        <h1 style={{ fontSize: "4rem", fontWeight: 800, color: "var(--primary)" }}>404</h1>
        <h2 className="mb-3">Page Not Found</h2>
        <p className="mb-4 text-muted">
            Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to="/home" className="btn btn-primary">
            Go to Home
        </Link>
    </div>
);

export default NotFound;