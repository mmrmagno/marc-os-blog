import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    // Check if user is accessing from authorized IP
    const checkAuthorization = async () => {
      try {
        const response = await fetch('/auth/check-ip');
        setIsAuthorized(response.ok);
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  const logOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Protected route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthorized) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} logOut={logOut} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route 
              path="/login" 
              element={
                <ProtectedRoute>
                  {isAuthenticated ? 
                    <Navigate to="/dashboard" /> : 
                    <Login setIsAuthenticated={setIsAuthenticated} />
                  }
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  {isAuthenticated ? 
                    <Dashboard /> : 
                    <Navigate to="/login" />
                  }
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
