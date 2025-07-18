import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/register', formData);
      alert(res.data.message); // Should say "User registered successfully"
      // Navigate to login page after successful registration
      navigate('/login');
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert('Registration failed');
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
          📝 Register
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#34495e'
            }}>
              👤 Name *
            </label>
            <input 
              name="name" 
              placeholder="Enter your full name" 
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
              📧 Email *
            </label>
            <input 
              name="email" 
              placeholder="Enter your email" 
              type="email" 
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
              🔒 Password *
            </label>
            <input 
              name="password" 
              placeholder="Create a strong password" 
              type="password" 
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

          <button 
            type="submit"
            style={{
              backgroundColor: '#27ae60',
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
            onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            🚀 Register
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#6c757d' }}>
            Already have an account?{' '}
            <span 
              onClick={() => navigate('/login')}
              style={{ 
                color: '#3498db', 
                cursor: 'pointer', 
                textDecoration: 'underline' 
              }}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
