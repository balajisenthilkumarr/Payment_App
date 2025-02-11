// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../config/overrides';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';


import { getTransactionDetails } from '../services/paymentService';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  

  // Handle login logic
  const login = async (credential) => {
    const loadingToast = toast.loading('Signing in...');
    try {
      setLoading(true);
      const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log(data);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      toast.success('Welcome back!', { id: loadingToast });
     
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.', { id: loadingToast });
      throw error;
    } finally {
      setLoading(false);
    }
  };


  // Handle logout logic
  const logout = () => {
    setUser(null);
    setProfile(null);
    setTransactions([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login'); // Redirect to login page after logout
  };


  const handleTransaction = async () => {
    if (!user?.email) {
      console.error("User email not found.");
      return;
    }
    const transactionData = await getTransactionDetails(user.email);
    console.log("TRANSACATIONDATA",transactionData);
    setTransactions(transactionData);
   
  };

  



  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await response.json();
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Could not fetch profile');
      throw error;
    }
  };



  

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        try {
          //await fetchProfile();
          //await fetchTransactions();
        } catch (error) {
          console.error('Error initializing auth:', error);
          logout(); // Log out if there's an issue fetching data
        }
      } else {
        navigate('/login'); // Redirect to login if no user or token found
      }
      setLoading(false);
    };

    initializeAuth();
  }, [navigate]); // Dependency on navigate and logout to prevent rerender issues

  const value = {
    user,
    profile,
    transactions,
    handleTransaction,
    loading,
    login,
    logout,
    fetchProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {user ? <Navbar /> :"NULL"} {/* Show Navbar if user is logged in */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
