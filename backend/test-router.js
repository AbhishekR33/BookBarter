// Test route functionality
console.log('🔍 Testing route functionality...');

// Clear require cache
delete require.cache[require.resolve('./routes/bookRoutes')];

try {
  const bookRoutes = require('./routes/bookRoutes');
  console.log('📚 bookRoutes type:', typeof bookRoutes);
  console.log('📚 bookRoutes constructor:', bookRoutes.constructor.name);
  
  if (typeof bookRoutes === 'function') {
    console.log('✅ bookRoutes is a function (good!)');
  } else {
    console.log('❌ bookRoutes is not a function');
    console.log('Content:', Object.keys(bookRoutes));
  }
  
} catch (error) {
  console.error('❌ Error with bookRoutes:', error.message);
}

console.log('🏁 Test complete');
