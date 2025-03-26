import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  useEffect(() => {
    const createGridLines = () => {
      const bgElements = document.querySelector('.background-elements');
      
      // Create horizontal grid lines
      for (let i = 0; i < 20; i++) {
        const lineH = document.createElement('div');
        lineH.className = 'grid-line grid-line-h';
        lineH.style.top = `${i * 5}%`;
        bgElements.appendChild(lineH);
      }
      
      // Create vertical grid lines
      for (let i = 0; i < 20; i++) {
        const lineV = document.createElement('div');
        lineV.className = 'grid-line grid-line-v';
        lineV.style.left = `${i * 5}%`;
        bgElements.appendChild(lineV);
      }
    };

    createGridLines();
  }, []);

  return (
    <div className="not-found">
      <div className="background-elements" />
      
      <div className="container">
        <div className="error-code">
          <span className="glitch">404</span>
        </div>
        
        <div className="console">
          <div className="console-content">
            <span className="console-line">
              <span className="console-prompt">marc@marc-os:</span>
              <span className="console-dir">~/blog.marc-os.com</span>$ 
              <span className="console-command">find</span> page
            </span>
            <span className="console-line">
              <span className="console-error">Error: Page not found</span>
            </span>
            <span className="console-line">
              <span className="console-prompt">marc@marc-os:</span>
              <span className="console-dir">~/blog.marc-os.com</span>$ 
              <span className="console-command">locate</span> <span className="console-file">requested_resource.html</span>
            </span>
            <span className="console-line">
              <span className="console-location">404: Resource does not exist</span>
            </span>
            <span className="console-line">
              <span className="console-prompt">marc@marc-os:</span>
              <span className="console-dir">~/blog.marc-os.com</span>$ <span className="cursor"></span>
            </span>
          </div>
        </div>
        
        <div className="message">
          <h1>Page Not Found</h1>
          <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <Link to="/" className="back-button">Return to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 