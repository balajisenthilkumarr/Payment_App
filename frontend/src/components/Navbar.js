import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, profile,logout} = useAuth();
  const handleLogout = () => {
    logout(); 
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600">PaymentApp</span>
          </div>
          
          {/* User Profile and Notifications */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="flex items-center space-x-3">
              {/* Profile Picture or Initial */}
              {profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {profile?.name || user?.name || 'User'}
                </p>
                <p className="text-gray-500">
                  {profile?.email || user?.email || 'user@example.com'}
                </p>
              </div>
              
              
              {/* Logout Button */}
              <button to="/login" className="ml-2 text-red-500 hover:text-red-700 text-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;