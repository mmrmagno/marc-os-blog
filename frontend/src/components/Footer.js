import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/" className="footer-logo-link">
              Marc-OS
            </Link>
            <p className="footer-tagline">Personal website and blog</p>
          </div>
          
          <div className="footer-links">
            <h3>Navigation</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Me</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Connect</h3>
            <ul>
              <li><a href="https://github.com/marcosmagno" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://linkedin.com/in/marcosmagno" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="mailto:contact@marc-os.com">Email</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Marc-OS. All rights reserved.</p>
          <Link to="/login" className="admin-link">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
