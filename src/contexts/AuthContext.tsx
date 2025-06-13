// Import necessary React hooks and types
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a User interface representing the user object structure
interface User {
  id: ...;
  name: ..;
  email: ..;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null; // Stores the authenticated user or null if not logged in
  login: (email: string, password: string) => Promise<void>; // Function to log in
  register: (name: string, email: string, password: string) => Promise<void>; // Function to register
  logout: () => void; // Function to log out
  loading: boolean; // Flag to indicate loading state
  error: string | null; // Error message, if any
}

// Create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode; // Any children components that will use this context
}

// AuthProvider component to wrap around parts of the app that need auth
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error message state

  const API_BASE = 'http://localhost:5000/api'; // Base URL of your backend API

  // Check for existing token in localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token); // Validate the token if it exists
    } else {
      setLoading(false); // Done loading if no token
    }
  }, []);

  // Verify token by calling the backend
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.user.userId,
          name: data.user.name || 'User',
          email: data.user.email,
        });
      } else {
        localStorage.removeItem('token'); // Invalid token, remove it
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token'); // Handle token verification errors
    } finally {
      setLoading(false); // Done loading regardless of outcome
    }
  };

  // Login function: sends email/password to backend
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send credentials
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Save token
        setUser(data.user); // Update user state
      } else {
        setError(data.message || 'Login failed'); // Handle login error
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false); // Done loading
    }
  };

  // Register function: sends name/email/password to backend
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }), // Send registration data
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Save token
        setUser(data.user); // Update user state
      } else {
        setError(data.message || 'Registration failed'); // Handle registration error
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false); // Done loading
    }
  };

  // Logout function: clear user state and remove token
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    setUser(null); // Clear user state
  };

  // Context value that will be provided to children
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
  };

  // Provide the context to children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
