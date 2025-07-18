// Test individual route imports
console.log('🔍 Testing route imports...');

try {
  console.log('📋 Testing userRoutes...');
  const userRoutes = require('./routes/userRoutes');
  console.log('✅ userRoutes imported successfully');
  console.log('Type:', typeof userRoutes);
} catch (error) {
  console.error('❌ Error importing userRoutes:', error.message);
}

try {
  console.log('📚 Testing bookRoutes...');
  const bookRoutes = require('./routes/bookRoutes');
  console.log('✅ bookRoutes imported successfully');
  console.log('Type:', typeof bookRoutes);
} catch (error) {
  console.error('❌ Error importing bookRoutes:', error.message);
}

try {
  console.log('🔔 Testing notificationRoutes...');
  const notificationRoutes = require('./routes/notificationRoutes');
  console.log('✅ notificationRoutes imported successfully');
  console.log('Type:', typeof notificationRoutes);
} catch (error) {
  console.error('❌ Error importing notificationRoutes:', error.message);
}

console.log('🏁 Import test complete');
