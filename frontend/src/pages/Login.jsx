import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      alert('Please enter both email and password');
      return;
    }
    
    try {
      console.log('🔐 Attempting login for:', email);
      console.log('📡 Sending request to:', '/users/login');
      
      const res = await axios.post('/users/login', {
        email: email.trim(),
        password,
      });
      
      console.log('✅ Login response:', res.data);
      alert(res.data.message);
      console.log('Logged in user ID:', res.data.userId);
      
      // Store user info in localStorage for authentication
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Trigger storage event to update App state
      window.dispatchEvent(new Event('storage'));
      
      // Navigate to My Books page after successful login
      navigate('/my-books');
    } catch (error) {
      console.error('❌ Login error details:', error);
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        console.log('📄 Error response:', data);
        
        if (status === 404) {
          alert('User not found. Please check your email or register first.');
        } else if (status === 401) {
          alert('Invalid password. Please try again.');
        } else if (status === 500) {
          alert('Server error. Please try again later.');
          console.error('Server error details:', data);
        } else {
          alert(`Login failed: ${data.error || 'Unknown error'}`);
        }
      } else if (error.request) {
        // Network error
        console.error('📡 Network error:', error.request);
        alert('Cannot connect to server. Please check if the backend is running.');
      } else {
        // Other error
        console.error('⚠️ Unexpected error:', error.message);
        alert('Login failed: ' + error.message);
      }
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '500px', 
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
          🔐 Login
        </h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#34495e'
            }}>
              📧 Email *
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              🔒 Password *
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button 
            type="submit"
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              marginTop: '10px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            🚀 Login
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#6c757d' }}>
            Don't have an account?{' '}
            <span 
              onClick={() => navigate('/register')}
              style={{ 
                color: '#3498db', 
                cursor: 'pointer', 
                textDecoration: 'underline' 
              }}
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
