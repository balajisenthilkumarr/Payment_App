import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
 
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: '#DFF2BF',
              color: '#4F8A10',
            },
          },
          error: {
            style: {
              background: '#FFD2D2',
              color: '#D8000C',
            },
            duration: 5000,
          },
        }}
      />
      
   
   
  );
};

export default App;
