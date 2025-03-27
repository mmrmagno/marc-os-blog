import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Try to access the current path
        const response = await fetch(location.pathname);
        if (response.status === 403) {
          // Force a full page reload to show the block page
          window.location.href = location.pathname;
          return;
        }
        setIsChecking(false);
      } catch (error) {
        // If there's an error, assume it's blocked
        window.location.href = location.pathname;
      }
    };

    checkAccess();
  }, [location.pathname]);

  if (isChecking) {
    return null; // or a loading spinner
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
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
