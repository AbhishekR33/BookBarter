// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UploadBook from './pages/UploadBook';
import BookList from './pages/BookList';
import { isAuthenticated, logout } from './utils/auth';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

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
            <a href="/" style={{ 
              color: '#ecf0f1', 
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
              🏠 Home
            </a>
            <a href="/books" style={{ 
              color: '#ecf0f1', 
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
              📚 Books
            </a>
            
            {authenticated && (
              <a href="/upload" style={{ 
                color: '#ecf0f1', 
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                📤 Upload
              </a>
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
                <a href="/login" style={{ 
                  color: '#ecf0f1', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                  🔐 Login
                </a>
                <a href="/register" style={{ 
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
                </a>
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
      </Routes>
    </Router>
  );
}

export default App;
