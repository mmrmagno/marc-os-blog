import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Blocked.css';

const Blocked = () => {
  return (
    <div className="blocked">
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      <div className="container">
        <div className="blocked-sign">
          <div className="octagon-border"></div>
          <div className="octagon">
            <span className="block-text">⛔</span>
          </div>
        </div>
        
        <div className="message">
          <h1>Access Blocked</h1>
          <p>We're sorry, but you do not have permission to access this resource.</p>
          <Link to="/" className="back-button">Return to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default Blocked; 