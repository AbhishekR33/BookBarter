// src/pages/UploadBook.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { requireAuth, getUserId } from '../utils/auth';

const UploadBook = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    availability: 'for_both',
    condition: 'good'
  });

  // Check authentication when component mounts
  useEffect(() => {
    if (!requireAuth(navigate)) {
      return; // Stop execution if not authenticated
    }
  }, [navigate]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Double-check authentication before submitting
    if (!requireAuth(navigate)) {
      return;
    }

    const userId = getUserId();
    if (!userId) {
      alert('Error: User not authenticated. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const bookData = {
        ...book,
        owner: userId // Add the user ID as the owner
      };
      
      console.log('📤 Uploading book:', bookData); // Debug log
      await axios.post('/books', bookData); // Changed from /books/upload to /books
      alert('Book uploaded successfully!');
      setBook({ 
        title: '', 
        author: '', 
        description: '', 
        price: '',
        availability: 'for_both',
        condition: 'good'
      });
      // Navigate back to books list
      navigate('/books');
    } catch (err) {
      console.error('❌ Upload error:', err.response?.data || err.message);
      alert(`Failed to upload book: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#2c3e50', 
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '2em'
        }}>
          📚 Upload a Book
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#34495e'
            }}>
              📖 Book Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter book title"
              value={book.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#34495e'
            }}>
              ✍️ Author *
            </label>
            <input
              type="text"
              name="author"
              placeholder="Enter author name"
              value={book.author}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#34495e'
            }}>
              💰 Price (₹)
            </label>
            <input
              type="number"
              name="price"
              placeholder="Enter price in rupees"
              value={book.price}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#34495e'
            }}>
              🏷️ Availability *
            </label>
            <select
              name="availability"
              value={book.availability}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'white',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              <option value="for_sale">💰 For Sale Only</option>
              <option value="for_exchange">🔄 For Exchange Only</option>
              <option value="for_both">💱 For Sale & Exchange</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#34495e'
            }}>
              📊 Book Condition *
            </label>
            <select
              name="condition"
              value={book.condition}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'white',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              <option value="excellent">✨ Excellent - Like New</option>
              <option value="good">👍 Good - Minor Wear</option>
              <option value="fair">📖 Fair - Noticeable Wear</option>
              <option value="poor">📄 Poor - Heavy Wear</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#34495e'
            }}>
              📝 Description
            </label>
            <textarea
              name="description"
              placeholder="Tell us about the book..."
              value={book.description}
              onChange={handleChange}
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button 
              type="submit"
              style={{
                flex: 1,
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
            >
              📤 Upload Book
            </button>
            
            <button 
              type="button"
              onClick={() => navigate('/books')}
              style={{
                flex: 1,
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#545b62'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              📚 Back to Books
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadBook;
