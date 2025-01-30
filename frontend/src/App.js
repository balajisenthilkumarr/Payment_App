import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

function App() {
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState({
    name:"balaji",
    email:"balajivijjay3447#@gmail.com",
    profileIcon:"https://www.clipartkey.com/mpngs/m/197-1971414_avatars-clipart-generic-user-user-profile-icon.png"
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
  const apiUrl = process.env.REACT_APP_BACKEND_API_URL;

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Function to initiate the payment
  const initiatePayment = async () => {
    const trimmedUserId = userId.trim();
    if (!amount || !userId) {
      alert('Please provide both user ID and amount');
      return;
    }
    const response = await fetch(`${apiUrl}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: trimmedUserId,amount: parseInt(amount) }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("data orders",data);
    const { id: orderId, amount: orderAmount } = data; // Extract orderId and orderAmount from the response
    console.log("Order created:", orderId, orderAmount);

    // Options for Razorpay checkout
    const options = {
      key: razorpayKey, // Replace with your Razorpay key
      amount: orderAmount,
      currency: "INR",
      order_id: orderId,
      handler: function (response) {
        const paymentId = response.razorpay_payment_id;
        const order_Id = response.razorpay_order_id;
        console.log('Payment Response:', paymentId, order_Id);

        // Call your backend to capture the payment
        fetch(`${apiUrl}/payment/capture-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_id: paymentId,
            order_id: orderId,
            amount: orderAmount,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Payment captured:', data);
            alert("Payment successful!");
          })
          .catch(error => {
            console.error('Error capturing payment:', error);
            alert("Payment capture failed!");
          });
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#F37254",
      },
    };

    // Create the Razorpay instance and open the checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  
  return (
    <>
      <Navbar userid={userId} />
      <div className="flex justify-start p-8">
        {/* Left-aligned Payment Form */}
          <div className="max-w-2xl p-10 bg-[#F7FAFC]shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Payment Portal</h1>
            <div className="space-y-8">
              {/* User ID Input */}
            <div>
              <label htmlFor="userId" className="block text-xl font-medium text-gray-700">User ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter User ID" />
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-xl font-medium text-gray-700">Amount</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Amount" />
            </div>

            {/* Confirm Payment Checkbox */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="confirmPayment"
                checked={isConfirmed}
                onChange={() => setIsConfirmed(!isConfirmed)}
                className="h-6 w-6 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500" />
              <label htmlFor="confirmPayment" className="text-xl">I confirm this payment</label>
            </div>

            {/* Pay Now Button */}
            <div className="mt-8">
              <button
                onClick={initiatePayment}
                disabled={!isConfirmed || !userId || !amount}
                className="w-full p-4 text-xl text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
