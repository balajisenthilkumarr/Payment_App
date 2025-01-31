import React, { createContext, useContext, useState } from 'react';
import { CONFIG } from '../config/overrides';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Welcome back!', { id: loadingToast });
      
      // Automatically fetch profile after login
      await fetchProfile();
      await fetchTransactions();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.', { id: loadingToast });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/user/profile`, {
        method: 'GET',
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

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/transactions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const transactionsData = await response.json();
      setTransactions(transactionsData);
      return transactionsData;
    } catch (error) {
      console.error('Transactions fetch error:', error);
      toast.error('Could not fetch transactions');
      throw error;
    }
  };

  const logout = () => {
    toast.promise(
      new Promise((resolve) => {
        setUser(null);
        setProfile(null);
        setTransactions([]);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setTimeout(resolve, 500); // Small delay for better UX
      }),
      {
        loading: 'Signing out...',
        success: 'See you again!',
        error: 'Logout failed'
      }
    );
  };

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // Optionally fetch profile and transactions on app reload
      fetchProfile();
      fetchTransactions();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      transactions, 
      loading, 
      login, 
      logout, 
      fetchProfile, 
      fetchTransactions 
    }}>
        <Navbar /> 
        {!loading ? <Dashboard /> : <Login />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);