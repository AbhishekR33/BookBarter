// src/pages/MyBooks.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { requireAuth, getUserId } from '../utils/auth';

const MyBooks = () => {
  const navigate = useNavigate();
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    description: '',
    price: ''
  });

  // Check authentication when component mounts
  useEffect(() => {
    if (!requireAuth(navigate)) {
      return; // Stop execution if not authenticated
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const userId = getUserId();
        console.log('🔍 Fetching books for user ID:', userId); // Debug log
        
        if (!userId) {
          console.error('❌ No user ID found, redirecting to login');
          navigate('/login');
          return;
        }

        // Use the proper endpoint to get user-specific books
        const res = await axios.get(`/books/user/${userId}`);
        console.log('✅ User books from API:', res.data); // Debug log
        
        setMyBooks(res.data);
      } catch (err) {
        console.error('❌ Error fetching my books:', err.response?.data || err.message);
        setError(`Failed to load your books: ${err.response?.data?.message || err.message}`);
        if (err.response?.status === 401) {
          // Unauthorized - redirect to login
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [navigate]);

  const deleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/books/${bookId}`);
        setMyBooks(myBooks.filter(book => book._id !== bookId));
        alert('Book deleted successfully!');
      } catch (err) {
        console.error('❌ Error deleting book:', err);
        alert('Failed to delete book');
      }
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price || ''
    });
    setShowEditModal(true);
  };

  const updateBook = async () => {
    try {
      await axios.put(`/books/${editingBook._id}`, editForm);
      
      // Update the book in the local state
      setMyBooks(myBooks.map(book => 
        book._id === editingBook._id 
          ? { ...book, ...editForm }
          : book
      ));
      
      alert('Book updated successfully!');
      setShowEditModal(false);
      setEditingBook(null);
    } catch (err) {
      console.error('❌ Error updating book:', err);
      alert('Failed to update book');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>📚 Loading your books...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#e74c3c' }}>⚠️ Error</h2>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>📖 My Books</h2>
        <button 
          onClick={() => navigate('/upload')} 
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          + Upload New Book
        </button>
      </div>
      
      {myBooks.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '2px dashed #dee2e6'
        }}>
          <h3 style={{ color: '#6c757d', marginBottom: '20px' }}>You haven't uploaded any books yet</h3>
          <p style={{ color: '#6c757d', marginBottom: '30px' }}>Start sharing your books with the community!</p>
          <button 
            onClick={() => navigate('/upload')}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            Upload Your First Book
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {myBooks.map((book) => (
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
              <h3 style={{ 
                color: '#2c3e50', 
                marginBottom: '10px',
                fontSize: '1.3em',
                borderBottom: '2px solid #3498db',
                paddingBottom: '8px'
              }}>
                {book.title}
              </h3>
              <p style={{ 
                color: '#7f8c8d', 
                marginBottom: '10px',
                fontSize: '1.1em',
                fontWeight: '500'
              }}>
                <strong>📖 Author:</strong> {book.author}
              </p>
              <p style={{ 
                color: '#555', 
                marginBottom: '15px',
                lineHeight: '1.5',
                fontSize: '0.95em'
              }}>
                {book.description}
              </p>
              {book.price && (
                <p style={{ 
                  color: '#27ae60',
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                  margin: '15px 0 10px 0'
                }}>
                  💰 ₹{book.price}
                </p>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                  onClick={() => openEditModal(book)}
                  style={{
                    backgroundColor: '#f39c12',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    flex: 1
                  }}
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => deleteBook(book._id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    flex: 1
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && editingBook && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
              ✏️ Edit Book - {editingBook.title}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Author *
                </label>
                <input
                  type="text"
                  value={editForm.author}
                  onChange={(e) => setEditForm({...editForm, author: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '16px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button
                onClick={updateBook}
                style={{
                  flex: 1,
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                💾 Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBook(null);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooks;
