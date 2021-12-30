import React from "react";

const Header = ({ title = "Page Title" }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid pr-5">
                <h3>{title}</h3>
            </div>
        </nav>
    );
};

export default Header;