import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import '../styles/Navbar.css';

const Navbar = ({ isAuthenticated, logOut }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <Logo width={40} height={40} />
          </Link>
        </div>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          <div className={isMobileMenuOpen ? 'hamburger open' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              About Me
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/blog" 
              className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Blog
            </Link>
          </li>

          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>
              
              <li className="nav-item">
                <button 
                  className="nav-link logout-button"
                  onClick={() => {
                    logOut();
                    closeMobileMenu();
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
