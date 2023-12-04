// src/components/Navbar.js
import React from 'react';
import './style/Navbar.css';

const Navbar = () => {
    return (
        <nav>
            <div className="navbar-container">
                <h1>Green City</h1>
                <ul className="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/withdraw">Withdraw</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/team">Team</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
