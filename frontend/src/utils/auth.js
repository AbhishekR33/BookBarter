// Authentication utility functions
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('userId');
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userId');
};

export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    alert('Please login to access this page');
    navigate('/login');
    return false;
  }
  return true;
};
