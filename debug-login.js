// Login Diagnostic Script
// Run this in browser console when on the login page

async function testLogin() {
  console.log('🔍 Testing login system...');
  
  // Test 1: Check if backend is accessible
  try {
    console.log('📡 Testing backend connection...');
    const response = await fetch('http://localhost:5000');
    const text = await response.text();
    console.log('✅ Backend response:', text);
  } catch (error) {
    console.error('❌ Backend not accessible:', error);
    console.log('🔧 Make sure to start backend server: cd backend && npm start');
    return;
  }
  
  // Test 2: Check if login endpoint is working
  try {
    console.log('🔐 Testing login endpoint...');
    const loginResponse = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'wrongpassword' })
    });
    
    const loginResult = await loginResponse.json();
    console.log('📝 Login endpoint response:', loginResult);
    
    if (loginResponse.status === 404) {
      console.log('ℹ️  This is expected for non-existent user');
    } else if (loginResponse.status === 401) {
      console.log('ℹ️  This is expected for wrong password');
    }
    
  } catch (error) {
    console.error('❌ Login endpoint error:', error);
  }
  
  // Test 3: Check localStorage
  console.log('💾 Current localStorage:');
  console.log('userId:', localStorage.getItem('userId'));
  console.log('isAuthenticated:', localStorage.getItem('isAuthenticated'));
  
  // Test 4: Check network tab
  console.log('🌐 Open Network tab in DevTools and try login to see exact error');
  console.log('🔍 Look for 500 errors, CORS issues, or connection refused');
}

// Auto-run the test
testLogin();

// Helper function to clear auth and retry
function clearAuthAndRetry() {
  localStorage.removeItem('userId');
  localStorage.removeItem('isAuthenticated');
  console.log('🧹 Cleared authentication data. Try logging in again.');
}
