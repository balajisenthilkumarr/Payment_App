// src/components/Login.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    console.log("token",credentialResponse);
    try {
      await login(credentialResponse.credential);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleError = () => {
    toast.error('Login failed. Please try again.');
  };

  const handleLegalClick = (type) => {
    toast.info(`${type} page will be available soon.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col justify-center">
      <Toaster
        position="top-right"
        toastOptions={{
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
          },
        }}
      />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to PaymentApp
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to continue
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-full bg-gray-50 p-4 rounded-lg text-sm text-gray-500 text-center">
                Secure login with Google
              </div>
              
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  useOneTap
                  shape="rectangular"
                  size="large"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Secure payment platform
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm text-gray-500">
              <div>
                <div className="font-semibold text-indigo-600">Fast</div>
                <div>Instant transfers</div>
              </div>
              <div>
                <div className="font-semibold text-indigo-600">Secure</div>
                <div>End-to-end encryption</div>
              </div>
              <div>
                <div className="font-semibold text-indigo-600">Reliable</div>
                <div>24/7 support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        By continuing, you agree to our{' '}
        <button
          onClick={() => handleLegalClick('Terms of Service')}
          className="font-medium text-indigo-600 hover:text-indigo-500 underline"
        >
          Terms of Service
        </button>{' '}
        and{' '}
        <button
          onClick={() => handleLegalClick('Privacy Policy')}
          className="font-medium text-indigo-600 hover:text-indigo-500 underline"
        >
          Privacy Policy
        </button>
      </div>
    </div>
  );
};

export default Login;