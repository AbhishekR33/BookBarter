// Quick notification debugging script
// Test this in browser console or as a standalone test

// Check if notifications API is working
async function testNotifications() {
  console.log('🔍 Testing notification system...');
  
  // Test 1: Check if backend is running
  try {
    const response = await fetch('http://localhost:5000');
    const text = await response.text();
    console.log('✅ Backend status:', text);
  } catch (error) {
    console.error('❌ Backend not running:', error);
    return;
  }
  
  // Test 2: Check notification endpoints (replace USER_ID with actual user ID)
  const userId = localStorage.getItem('userId'); // Get from localStorage
  if (!userId) {
    console.error('❌ No user ID found in localStorage');
    return;
  }
  
  try {
    // Test fetching notifications
    const notifResponse = await fetch(`http://localhost:5000/api/notifications/user/${userId}`);
    const notifications = await notifResponse.json();
    console.log('✅ Notifications fetched:', notifications.length, 'notifications');
    console.log('📋 Sample notification:', notifications[0]);
    
    // Check contact info in notifications
    const withContactInfo = notifications.filter(n => n.contactInfo && (n.contactInfo.email || n.contactInfo.phone));
    console.log('📞 Notifications with contact info:', withContactInfo.length);
    
    if (withContactInfo.length > 0) {
      console.log('📧 Contact info sample:', withContactInfo[0].contactInfo);
    } else {
      console.log('⚠️ No notifications found with contact info');
    }
    
  } catch (error) {
    console.error('❌ Error testing notifications:', error);
  }
}

// Run the test
testNotifications();
