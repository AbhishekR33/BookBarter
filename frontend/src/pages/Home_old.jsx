// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { isAuthenticated } from '../utils/auth';

const Home = () => {
  const navigate = useNavigate();
  const [recentBooks, setRecentBooks] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0 });
  const authenticated = isAuthenticated();

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        const res = await axios.get('/books');
        // Get the 6 most recent books
        setRecentBooks(res.data.slice(0, 6));
        setStats(prev => ({ ...prev, totalBooks: res.data.length }));
      } catch (err) {
        console.error('Error fetching recent books:', err);
      }
    };

    fetchRecentBooks();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
        color: 'white',
        padding: '60px 40px',
        borderRadius: '15px',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ 
          fontSize: '3em', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          📚 Welcome to BookBarter
        </h1>
        <p style={{ 
          fontSize: '1.3em', 
          marginBottom: '30px',
          opacity: 0.9
        }}>
          Share books, discover new reads, and connect with fellow book lovers
        </p>
        {authenticated ? (
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/my-books')}
              style={{
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              📖 My Books
            </button>
            <button
              onClick={() => navigate('/upload')}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              📤 Upload Book
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              🚀 Get Started
            </button>
            <button
              onClick={() => navigate('/books')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              📚 Browse Books
            </button>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#3498db', fontSize: '2.5em', margin: '0 0 10px 0' }}>
            {stats.totalBooks}
          </h3>
          <p style={{ color: '#6c757d', fontSize: '1.1em', margin: 0 }}>
            📚 Books Available
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#27ae60', fontSize: '2.5em', margin: '0 0 10px 0' }}>
            ∞
          </h3>
          <p style={{ color: '#6c757d', fontSize: '1.1em', margin: 0 }}>
            🤝 Exchange Opportunities
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#e74c3c', fontSize: '2.5em', margin: '0 0 10px 0' }}>
            FREE
          </h3>
          <p style={{ color: '#6c757d', fontSize: '1.1em', margin: 0 }}>
            💰 Platform Usage
          </p>
        </div>
      </div>

      {/* Recent Books Section */}
      {recentBooks.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#2c3e50', margin: 0 }}>🆕 Recently Added Books</h2>
            <button
              onClick={() => navigate('/books')}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              View All Books →
            </button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {recentBooks.map((book) => (
              <div key={book._id} style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}>
                <h4 style={{
                  color: '#2c3e50',
                  marginBottom: '8px',
                  fontSize: '1.1em'
                }}>
                  {book.title}
                </h4>
                <p style={{
                  color: '#7f8c8d',
                  marginBottom: '8px',
                  fontSize: '0.9em'
                }}>
                  by {book.author}
                </p>
                <p style={{
                  color: '#555',
                  fontSize: '0.85em',
                  lineHeight: '1.4',
                  marginBottom: '15px'
                }}>
                  {book.description?.substring(0, 80)}...
                </p>
                {book.price && (
                  <p style={{
                    color: '#27ae60',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    ₹{book.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '40px' }}>
          ✨ Why Choose BookBarter?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>🔄</div>
            <h3 style={{ color: '#3498db', marginBottom: '10px' }}>Easy Exchange</h3>
            <p style={{ color: '#6c757d' }}>
              Simple platform to upload your books and find ones you want to read
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>🌍</div>
            <h3 style={{ color: '#27ae60', marginBottom: '10px' }}>Eco-Friendly</h3>
            <p style={{ color: '#6c757d' }}>
              Reduce waste by giving books a second life with new readers
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>🤝</div>
            <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>Community</h3>
            <p style={{ color: '#6c757d' }}>
              Connect with fellow book lovers and discover new recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
