import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "/images/shop_logo.png";

function Footer() {
    
const navigate = useNavigate();
const handleGetStarted = () => {
    const token = localStorage.getItem("token"); // or "user"
    if(token){
        navigate("/dashboard");
    }
    else{
        navigate("/auth");
    }
};
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Brand */}
                <div className="footer-col">
                    <div className="footer-brand">
                        <img src={logo} alt="LocalWala Logo" className="footer-logo-img" />
                        <h2 className="footer-logo-text">LocalWala</h2>
                    </div>
                    <p>
                        From Streets to Screens — Bringing Local Shops Online.
                    </p>
                  
                </div>

                {/* Quick Links */}
                <div className="footer-col">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div className="footer-col">
                    <h3>Support</h3>
                    <ul>
                        <li><Link to="#">Help Center</Link></li>
                        <li><Link to="#">Privacy Policy</Link></li>
                        <li><Link to="#">Terms & Conditions</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h3>Contact</h3>
                    <p>Email: bansalharshitpc.091@outlook.com</p>
                </div>

            </div>

            {/* CTA (🔥 add this) */}
            <div className="footer-cta">
                <p>Start your digital journey today 🚀</p>
           <button className="footer-btn" onClick={handleGetStarted}>
            Create Your Shop
                </button>

            </div>

            {/* Bottom */}
            <div className="footer-bottom">
                <p>© 2026 LocalWala. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;