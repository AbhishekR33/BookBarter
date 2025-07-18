// Authentication utility functions
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('userId');
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const getUserEmail = () => {
  const email = localStorage.getItem('userEmail');
  // If no email stored, try to use a realistic default based on the user's name
  if (!email) {
    const userName = localStorage.getItem('userName');
    if (userName && userName !== 'User') {
      // Convert name to email format: "Abhishek Ravindra" -> "abhishek.ravindra@gmail.com"
      const emailName = userName.toLowerCase().replace(/\s+/g, '.');
      return `${emailName}@gmail.com`;
    }
    return 'user@gmail.com';
  }
  return email;
};

export const getUserName = () => {
  return localStorage.getItem('userName') || 'Abhishek Ravindra';
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
};

export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    alert('Please login to access this page');
    navigate('/login');
    return false;
  }
  return true;
};

// Set default user info for existing logged-in users
export const setDefaultUserInfo = () => {
  if (isAuthenticated() && !localStorage.getItem('userName')) {
    localStorage.setItem('userName', 'Abhishek Ravindra');
  }
  if (isAuthenticated() && !localStorage.getItem('userEmail')) {
    localStorage.setItem('userEmail', 'abhishek.ravindra@gmail.com');
  }
};
