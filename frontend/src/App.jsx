// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UploadBook from './pages/UploadBook';
import BookList from './pages/BookList';
import MyBooks from './pages/MyBooks';
import Notifications from './pages/Notifications';
import { isAuthenticated, logout, getUserId, getUserEmail, getUserName, setDefaultUserInfo } from './utils/auth';
import axios from './api/axios';
import './App.css';

// Navigation Component
const Navigation = ({ authenticated, unreadCount, onLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems = authenticated ? [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/books', label: 'Browse Books', icon: '📚' },
    { path: '/upload', label: 'Upload Book', icon: '📤' },
    { path: '/my-books', label: 'My Books', icon: '📖' },
    { 
      path: '/notifications', 
      label: 'Notifications', 
      icon: '🔔',
      badge: unreadCount > 0 ? unreadCount : null 
    }
  ] : [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/books', label: 'Browse Books', icon: '📚' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img src="/bukify-logo.png" alt="Bukify Logo" className="brand-logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="navbar-actions">
            {authenticated ? (
              <div className="user-menu">
                <div className="profile-section">
                  <button 
                    className="profile-btn"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <div className="profile-avatar">
                      <span className="profile-initial">
                        {getUserName()?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="profile-info">
                      <span className="profile-name">{getUserName() || 'User'}</span>
                      <span className="profile-email">{getUserEmail() || 'user@example.com'}</span>
                    </div>
                    <span className="profile-arrow">▼</span>
                  </button>
                  
                  {profileMenuOpen && (
                    <div className="profile-dropdown">
                      <div className="profile-dropdown-header">
                        <div className="profile-avatar-large">
                          {getUserName()?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="profile-name-large">{getUserName() || 'User'}</div>
                          <div className="profile-email-small">{getUserEmail() || 'user@example.com'}</div>
                        </div>
                      </div>
                      <div className="profile-dropdown-divider"></div>
                      <Link to="/profile" className="profile-dropdown-item">
                        <span className="dropdown-icon">👤</span>
                        View Profile
                      </Link>
                      <Link to="/settings" className="profile-dropdown-item">
                        <span className="dropdown-icon">⚙️</span>
                        Settings
                      </Link>
                      <Link to="/help" className="profile-dropdown-item">
                        <span className="dropdown-icon">❓</span>
                        Help
                      </Link>
                      <div className="profile-dropdown-divider"></div>
                      <button onClick={onLogout} className="profile-dropdown-item logout-btn">
                        <span className="dropdown-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${isActive(item.path) ? 'mobile-nav-link-active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </Link>
            ))}
            {!authenticated && (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    setAuthenticated(isAuthenticated());
    // Set default user info for existing sessions
    if (isAuthenticated()) {
      setDefaultUserInfo();
    }
    setLoading(false);
  }, []);

  // Update authentication status when storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthenticated(isAuthenticated());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch unread notification count
  useEffect(() => {
    if (authenticated) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const fetchUnreadCount = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        const response = await axios.get(`/notifications/unread/${userId}`);
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUnreadCount(0);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="loading"></div>
        </div>
        <p className="loading-text">Loading Bukify...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navigation 
          authenticated={authenticated}
          unreadCount={unreadCount}
          onLogout={handleLogout}
        />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/upload" element={<UploadBook />} />
            <Route path="/my-books" element={<MyBooks />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-brand">
                <img src="/bukify-logo.png" alt="Bukify Logo" className="footer-brand-logo" />
              </div>
              <p className="footer-text">
                Share knowledge, exchange books, build community.
              </p>
              <div className="footer-links">
                <a href="#" className="footer-link">About</a>
                <a href="#" className="footer-link">Privacy</a>
                <a href="#" className="footer-link">Terms</a>
                <a href="#" className="footer-link">Contact</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="copyright">
                © 2025 Abhishek Ravindra. All rights reserved. Built with ❤️ for book lovers.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
