import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">Welcome to Marc-OS, I'm Marc</h1>
        <div className="hero-buttons">
          <Link to="/about" className="hero-button">
            About Me
          </Link>
          <Link to="/blog" className="hero-button">
            Blog
          </Link>
        </div>
      </div>
      <div className="animated-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
};

export default Home;
