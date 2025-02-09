import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    // Admin login check
    if (email === 'admin' && password === 'admin') {
      const adminUser = {
        email: 'admin@example.com',
        displayName: 'Administrator',
        isAdmin: true,
      };
      setCurrentUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return Promise.resolve();
    }
    return Promise.reject(new Error('Invalid credentials'));
  }

  async function signup(email, password) {
    // For demo purposes, we'll just simulate a signup
    const newUser = {
      email,
      displayName: email.split('@')[0],
      isAdmin: false,
    };
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return Promise.resolve();
  }

  async function logout() {
    setCurrentUser(null);
    localStorage.removeItem('user');
    return Promise.resolve();
  }

  async function googleSignIn() {
    // Simulate Google sign in
    const googleUser = {
      email: 'google.user@example.com',
      displayName: 'Google User',
      isAdmin: false,
    };
    setCurrentUser(googleUser);
    localStorage.setItem('user', JSON.stringify(googleUser));
    return Promise.resolve();
  }

  async function facebookSignIn() {
    // Simulate Facebook sign in
    const facebookUser = {
      email: 'facebook.user@example.com',
      displayName: 'Facebook User',
      isAdmin: false,
    };
    setCurrentUser(facebookUser);
    localStorage.setItem('user', JSON.stringify(facebookUser));
    return Promise.resolve();
  }

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    googleSignIn,
    facebookSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
