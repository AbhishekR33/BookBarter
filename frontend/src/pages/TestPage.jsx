// Minimal test component to check if React is working
import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 React App is Working!</h1>
      <p>If you can see this, React is running correctly.</p>
      <p>The blank page issue might be caused by:</p>
      <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '20px auto' }}>
        <li>Backend server not running</li>
        <li>JavaScript errors in browser console</li>
        <li>Network connectivity issues</li>
        <li>Missing dependencies</li>
      </ul>
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
        <h3>Quick Debug Steps:</h3>
        <ol style={{ textAlign: 'left' }}>
          <li>Open browser console (F12) and check for errors</li>
          <li>Make sure backend server is running on port 5000</li>
          <li>Make sure frontend is running on port 5173</li>
          <li>Check network tab for failed API calls</li>
        </ol>
      </div>
    </div>
  );
};

export default TestPage;
