// src/pages/BookList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { getUserId, isAuthenticated } from '../utils/auth';

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactType, setContactType] = useState('contact');
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
  const [offerPrice, setOfferPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, title, author
  const currentUserId = getUserId();

  const openContactModal = (book, type = 'contact') => {
    if (!isAuthenticated()) {
      alert('Please login to contact book owners');
      navigate('/login');
      return;
    }
    
    // Prevent users from contacting themselves about their own books
    if (book.owner?._id === currentUserId) {
      alert('You cannot contact yourself about your own book!');
      return;
    }
    
    setSelectedBook(book);
    setContactType(type);
    
    // Set default messages based on contact type
    switch (type) {
      case 'buy_request':
        setContactMessage(`Hi! I'm interested in buying your book "${book.title}". Is it still available?`);
        setOfferPrice(book.price || '');
        break;
      case 'exchange_request':
        setContactMessage(`Hi! I'd like to exchange one of my books for "${book.title}". Are you interested in book exchanges?`);
        break;
      default:
        setContactMessage(`Hi! I'm interested in your book "${book.title}". Could you please provide more details about its condition and availability?`);
    }
    
    setShowContactModal(true);
  };

  const sendContactMessage = async () => {
    // Validate contact info - at least email should be provided
    if (!contactInfo.email.trim()) {
      alert('Please provide your email address so the owner can contact you back.');
      return;
    }
    
    try {
      const endpoint = contactType === 'buy_request' ? '/books/buy-request' : 
                     contactType === 'exchange_request' ? '/books/exchange-request' : 
                     '/books/contact';
      
      // Clean up contact info - only send non-empty values
      const cleanContactInfo = {};
      if (contactInfo.email.trim()) {
        cleanContactInfo.email = contactInfo.email.trim();
      }
      if (contactInfo.phone.trim()) {
        cleanContactInfo.phone = contactInfo.phone.trim();
      }
      
      const payload = {
        bookId: selectedBook._id,
        bookTitle: selectedBook.title,
        ownerId: selectedBook.owner,
        senderId: currentUserId,
        message: contactMessage,
        senderName: 'Current User', // You can get this from user profile later
        contactType: contactType,
        contactInfo: cleanContactInfo
      };

      if (contactType === 'buy_request') {
        payload.offerPrice = offerPrice;
      }

      await axios.post(endpoint, payload);
      
      const actionText = contactType === 'buy_request' ? 'Buy request' : 
                        contactType === 'exchange_request' ? 'Exchange request' : 
                        'Message';
      
      alert(`${actionText} sent successfully! The owner will be notified.`);
      setShowContactModal(false);
      resetModal();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const resetModal = () => {
    setContactMessage('');
    setSelectedBook(null);
    setContactType('contact');
    setContactInfo({ email: '', phone: '' });
    setOfferPrice('');
  };

  const filteredBooks = books.filter(book => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    switch (filterBy) {
      case 'title':
        return book.title.toLowerCase().includes(searchLower);
      case 'author':
        return book.author.toLowerCase().includes(searchLower);
      default:
        return book.title.toLowerCase().includes(searchLower) || 
               book.author.toLowerCase().includes(searchLower) ||
               book.description.toLowerCase().includes(searchLower);
    }
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('/books');
        setBooks(res.data);
      } catch (err) {
        console.error('❌ Error fetching books:', err);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>📚 All Books</h2>
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
          + Upload Book
        </button>
      </div>

      {/* Search and Filter Section */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '300px',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: 'white'
            }}
          >
            <option value="all">🔍 Search All</option>
            <option value="title">📖 Title Only</option>
            <option value="author">✍️ Author Only</option>
          </select>
          <div style={{ color: '#6c757d', fontSize: '14px' }}>
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>
      
      {filteredBooks.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '2px dashed #dee2e6'
        }}>
          {searchTerm ? (
            <>
              <h3 style={{ color: '#6c757d', marginBottom: '20px' }}>No books found for "{searchTerm}"</h3>
              <p style={{ color: '#6c757d', marginBottom: '30px' }}>Try a different search term or browse all books</p>
              <button 
                onClick={() => setSearchTerm('')}
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Show All Books
              </button>
            </>
          ) : (
            <>
              <h3 style={{ color: '#6c757d', marginBottom: '20px' }}>No books found</h3>
              <p style={{ color: '#6c757d', marginBottom: '30px' }}>Be the first to upload a book!</p>
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
            </>
          )}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredBooks.map((book) => (
            <div key={book._id} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid #e9ecef',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
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
              {book.owner === currentUserId ? (
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button 
                    onClick={() => navigate('/my-books')}
                    style={{
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      flex: 1
                    }}
                  >
                    📖 Manage This Book
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                  {/* Only show action buttons if this book is NOT owned by current user */}
                  {book.owner?._id !== currentUserId ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => openContactModal(book, 'contact')}
                        style={{
                          backgroundColor: '#3498db',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          flex: 1
                        }}
                      >
                        💬 Contact
                      </button>
                    {book.availability !== 'sold' && (book.availability === 'for_sale' || book.availability === 'for_both') && (
                      <button 
                        onClick={() => openContactModal(book, 'buy_request')}
                        style={{
                          backgroundColor: '#27ae60',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          flex: 1
                        }}
                      >
                        � Buy
                      </button>
                    )}
                    {book.availability !== 'sold' && (book.availability === 'for_exchange' || book.availability === 'for_both') && (
                      <button 
                        onClick={() => openContactModal(book, 'exchange_request')}
                        style={{
                          backgroundColor: '#f39c12',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          flex: 1
                        }}
                      >
                        🔄 Exchange
                      </button>
                    )}
                  </div>
                  ) : (
                    /* Show "Your Book" indicator for own books */
                    <div style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      📖 Your Book
                    </div>
                  )}
                  {book.availability === 'sold' && (
                    <div style={{ 
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      🚫 SOLD
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedBook && (
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
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
              {contactType === 'buy_request' ? '💰 Buy Request' : 
               contactType === 'exchange_request' ? '🔄 Exchange Request' : 
               '📧 Contact Owner'} - {selectedBook.title}
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>
              {contactType === 'buy_request' ? 'Send a buy offer for' : 
               contactType === 'exchange_request' ? 'Request book exchange for' : 
               'Send a message about'} "{selectedBook.title}" by {selectedBook.author}
            </p>

            {contactType === 'buy_request' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold',
                  color: '#34495e'
                }}>
                  💰 Your Offer Price (₹)
                </label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="Enter your offer price"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                {selectedBook.price && (
                  <p style={{ color: '#6c757d', fontSize: '14px', marginTop: '5px' }}>
                    Listed price: ₹{selectedBook.price}
                  </p>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold',
                color: '#34495e'
              }}>
                📝 Message
              </label>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Write your message here..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>📞 Your Contact Information</h4>
              <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '10px' }}>
                ⚠️ Email is required so the owner can reply to you
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  placeholder="Your email address *"
                  style={{
                    padding: '10px',
                    border: `2px solid ${!contactInfo.email.trim() ? '#e74c3c' : '#e9ecef'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: !contactInfo.email.trim() ? '#fdf2f2' : 'white'
                  }}
                />
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  placeholder="Your phone number (optional)"
                  style={{
                    padding: '10px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={sendContactMessage}
                style={{
                  flex: 1,
                  backgroundColor: contactType === 'buy_request' ? '#27ae60' : 
                                 contactType === 'exchange_request' ? '#f39c12' : '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                📤 Send {contactType === 'buy_request' ? 'Buy Request' : 
                         contactType === 'exchange_request' ? 'Exchange Request' : 'Message'}
              </button>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  resetModal();
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

export default BookList;
