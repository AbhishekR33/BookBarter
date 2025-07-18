// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UploadBook from './pages/UploadBook';
import BookList from './pages/BookList';
import MyBooks from './pages/MyBooks';
import Notifications from './pages/Notifications';
import { isAuthenticated, logout, getUserId } from './utils/auth';
import axios from './api/axios';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check authentication status on app load
  useEffect(() => {
    setAuthenticated(isAuthenticated());
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
      // Don't set unreadCount on error - just silently fail
      // This prevents the app from crashing if backend is down
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    window.location.href = '/'; // Redirect to home
  };

  return (
    <Router>
      <nav style={{ 
        padding: '1rem 2rem', 
        backgroundColor: '#2c3e50', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{ 
            color: '#ecf0f1', 
            margin: 0, 
            fontSize: '1.5em',
            fontWeight: 'bold'
          }}>
            📚 BookBarter
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ 
              color: '#ecf0f1', 
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
              🏠 Home
            </Link>
            <Link to="/books" style={{ 
              color: '#ecf0f1', 
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
              📚 All Books
            </Link>
            
            {authenticated && (
              <Link to="/my-books" style={{ 
                color: '#ecf0f1', 
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                📖 My Books
              </Link>
            )}
            
            {authenticated && (
              <Link to="/notifications" style={{ 
                color: '#ecf0f1', 
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                transition: 'background-color 0.3s',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                🔔 Notifications
                {unreadCount > 0 && (
                  <span style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '5px'
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
            
            {authenticated && (
              <Link to="/upload" style={{ 
                color: '#ecf0f1', 
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                📤 Upload
              </Link>
            )}
            
            {authenticated ? (
              <button 
                onClick={handleLogout}
                style={{ 
                  color: '#ecf0f1', 
                  backgroundColor: '#e74c3c',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                🚪 Logout
              </button>
            ) : (
              <>
                <Link to="/login" style={{ 
                  color: '#ecf0f1', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                  🔐 Login
                </Link>
                <Link to="/register" style={{ 
                  color: '#ecf0f1', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#27ae60',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}>
                  📝 Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<UploadBook />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
