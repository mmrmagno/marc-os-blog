import React from 'react';

const Logo = ({ className = '', width = 40, height = 40 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100"
    width={width}
    height={height}
    className={className}
  >
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e1e2e"/>
        <stop offset="100%" stopColor="#11111b"/>
      </linearGradient>
      
      <linearGradient id="mGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#cba6f7"/>
        <stop offset="100%" stopColor="#b4befe"/>
      </linearGradient>
      
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    
    <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" stroke="#313244" strokeWidth="2"/>
    
    <g id="matrixRain" opacity="0.7">
      {/* Matrix rain columns */}
      {[...Array(8)].map((_, i) => (
        <React.Fragment key={`col-${i}`}>
          <text x={10 + i * 10} y="15" fontFamily="monospace" fontSize="8" fill="#a6e3a1">1</text>
          <text x={10 + i * 10} y="25" fontFamily="monospace" fontSize="8" fill="#a6e3a1">0</text>
          <text x={10 + i * 10} y="35" fontFamily="monospace" fontSize="8" fill="#94e2d5">1</text>
          <text x={10 + i * 10} y="45" fontFamily="monospace" fontSize="8" fill="#94e2d5">0</text>
          <text x={10 + i * 10} y="55" fontFamily="monospace" fontSize="8" fill="#89dceb">1</text>
          <text x={10 + i * 10} y="65" fontFamily="monospace" fontSize="8" fill="#89dceb">0</text>
          <text x={10 + i * 10} y="75" fontFamily="monospace" fontSize="8" fill="#74c7ec">1</text>
          <text x={10 + i * 10} y="85" fontFamily="monospace" fontSize="8" fill="#74c7ec">0</text>
        </React.Fragment>
      ))}
    </g>
    
    <path 
      d="M25 30 L35 30 L50 60 L65 30 L75 30 L75 70 L65 70 L65 45 L50 75 L35 45 L35 70 L25 70 Z" 
      fill="url(#mGradient)" 
      filter="url(#glow)"
      stroke="#cba6f7" 
      strokeWidth="1"
    />
  </svg>
);

export default Logo; 