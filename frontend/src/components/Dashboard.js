// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Send, CreditCard, History } from 'lucide-react';

import { createOrder, capturePayment } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user ,transactions} = useAuth();
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState('send');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePayment = async () => {
    if (!amount || !userId) {
      toast.error('Please provide both user ID and amount');
      return;
    }

    if (!isConfirmed) {
      toast.error('Please confirm the payment details');
      return;
    }

    const paymentPromise = async () => {
      setIsLoading(true);
      try {
        const data = await createOrder(userId.trim(), amount);
        console.log("Order created:", data);
        
        const { id: orderId, amount: orderAmount } = data;

        return new Promise((resolve, reject) => {
          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            amount: orderAmount,
            currency: "INR",
            order_id: orderId,
            handler: async function(response) {
              try {
                const result = await capturePayment(
                  response.razorpay_payment_id,
                  orderId,
                  orderAmount
                );
                console.log('Payment captured:', result);
                
                setAmount('');
                setUserId('');
                setIsConfirmed(false);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            },
            prefill: {
              name: user?.name || '',
              email: user?.email || '',
              contact: user?.phone || '',
            },
            theme: {
              color: "#F37254",
            },
            modal: {
              ondismiss: () => {
                reject(new Error('Payment cancelled'));
              }
            }
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        });
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    toast.promise(
      paymentPromise(),
      {
        loading: 'Processing payment...',
        success: 'Payment successful! 🎉',
        error: (err) => `Payment failed: ${err.message || 'Something went wrong'}`
      }
    );
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value && Number(value) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    if (value && Number(value) > 100000) {
      toast.error('Amount cannot exceed ₹100,000');
      return;
    }
    setAmount(value);
  };

  const SendMoneyTab = () => (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">Send Money</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onBlur={() => {
            if (userId && userId.length < 3) {
              toast.error('User ID must be at least 3 characters');
            }
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          placeholder="Enter user ID"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount (INR)</label>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          placeholder="Enter amount"
          inputMode="decimal"
          pattern="[0-9]*\.?[0-9]{0,2}"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-gray-600">Confirm payment details</span>
      </div>
      <button
        onClick={handlePayment}
        disabled={!isConfirmed || !amount || !userId || isLoading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Processing...' : 'Send Money'}
      </button>
    </div>
  );

  const RequestMoneyTab = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Request Money</h2>
      <p className="text-gray-500">Coming soon: Request money feature</p>
    </div>
  );

  const TransactionsTab = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">To: John Doe</span>
            <span className="text-red-600">-₹500</span>
          </div>
          <span className="text-sm text-gray-500">2024-01-30</span>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'send':
        return <SendMoneyTab />;
      case 'request':
        return <RequestMoneyTab />;
      case 'transactions':
        return <TransactionsTab />;
      default:
        return <SendMoneyTab />;
    }
  };

  return (
    <>
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
      <main>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex items-center space-x-2 px-4 py-2 ${
              activeTab === 'send' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Send Money</span>
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`flex items-center space-x-2 px-4 py-2 ${
              activeTab === 'request' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Request Money</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center space-x-2 px-4 py-2 ${
              activeTab === 'transactions' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Transactions</span>
          </button>
        </div>

        {renderActiveTab()}
      </main>
    </>
  );
};

export default Dashboard;
