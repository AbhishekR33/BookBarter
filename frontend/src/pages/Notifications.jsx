import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { getUserId } from '../utils/auth';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    console.log('🔔 Notifications component mounted');
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = getUserId();
      console.log('🔍 Fetching notifications for user:', userId);
      console.log('🔍 User authentication status:', {
        authenticated: localStorage.getItem('isAuthenticated'),
        userId: localStorage.getItem('userId')
      });
      
      // Check if user ID matches expected format
      if (!userId) {
        console.error('❌ No user ID found');
        setError('No user ID found. Please log in again.');
        setLoading(false);
        return;
      }
      
      if (userId.length !== 24) {
        console.error('❌ Invalid user ID format:', userId);
        setError('Invalid user ID format. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('🌐 Making API call to:', `/notifications/user/${userId}`);
      const response = await axios.get(`/notifications/user/${userId}`);
      console.log('📨 Notifications response:', response.data);
      console.log('📊 Number of notifications:', response.data.length);
      setNotifications(response.data);
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      setError(`Failed to load notifications: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, status: 'read' }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'contact': return '📧';
      case 'buy_request': return '💰';
      case 'sell_request': return '🏷️';
      case 'exchange_request': return '🔄';
      default: return '📝';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'contact': return 'Contact Message';
      case 'buy_request': return 'Buy Request';
      case 'sell_request': return 'Sell Request';
      case 'exchange_request': return 'Exchange Request';
      default: return 'Message';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return notif.status === 'unread';
    if (filter === 'read') return notif.status === 'read';
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading notifications...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#e74c3c' }}>⚠️ Error Loading Notifications</h2>
        <p style={{ color: '#6c757d' }}>{error}</p>
        <button 
          onClick={fetchNotifications}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>
          🔔 Notifications ({notifications.length})
        </h1>
        
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '2px solid #e9ecef',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          <option value="all">All Notifications</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {filteredNotifications.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#6c757d' }}>
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h3>
          <p style={{ color: '#6c757d' }}>
            {filter === 'unread' 
              ? 'All caught up! 🎉' 
              : 'When someone contacts you about your books, notifications will appear here.'
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              style={{
                backgroundColor: notification.status === 'unread' ? '#e3f2fd' : 'white',
                border: `2px solid ${notification.status === 'unread' ? '#2196f3' : '#e9ecef'}`,
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>
                    {getTypeIcon(notification.type)}
                  </span>
                  <div>
                    <h4 style={{ margin: 0, color: '#2c3e50' }}>
                      {getTypeLabel(notification.type)}
                    </h4>
                    <p style={{ margin: '2px 0', color: '#6c757d', fontSize: '14px' }}>
                      From: {notification.sender.name} ({notification.sender.email})
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  {notification.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h5 style={{ color: '#2c3e50', margin: '0 0 5px 0' }}>
                  Book: {notification.book.title}
                </h5>
                <p style={{ color: '#495057', margin: '0 0 10px 0' }}>
                  {notification.message}
                </p>
              </div>

              {notification.contactInfo && (notification.contactInfo.email || notification.contactInfo.phone) && (
                <div style={{ 
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}>
                  <h6 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>📞 Contact Info:</h6>
                  {notification.contactInfo.email && notification.contactInfo.email.trim() && (
                    <p style={{ margin: '2px 0', fontSize: '14px' }}>
                      📧 Email: <a href={`mailto:${notification.contactInfo.email}`} style={{ color: '#3498db', textDecoration: 'none' }}>
                        {notification.contactInfo.email}
                      </a>
                    </p>
                  )}
                  {notification.contactInfo.phone && notification.contactInfo.phone.trim() && (
                    <p style={{ margin: '2px 0', fontSize: '14px' }}>
                      📞 Phone: <a href={`tel:${notification.contactInfo.phone}`} style={{ color: '#3498db', textDecoration: 'none' }}>
                        {notification.contactInfo.phone}
                      </a>
                    </p>
                  )}
                </div>
              )}
              
              <p style={{ 
                color: '#6c757d', 
                fontSize: '12px', 
                margin: 0,
                textAlign: 'right'
              }}>
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
