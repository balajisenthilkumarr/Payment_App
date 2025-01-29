import React, { useState, useEffect } from 'react';

function App() {
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState('');

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

    const response = await fetch('http://localhost:8000/api/payment/create-order', {
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
      key: "rzp_test_CzYecVDNqXcUd6", // Replace with your Razorpay key
      amount: orderAmount,
      currency: "INR",
      order_id: orderId,
      handler: function (response) {
        const paymentId = response.razorpay_payment_id;
        const order_Id = response.razorpay_order_id;
        console.log('Payment Response:', paymentId, order_Id);

        // Call your backend to capture the payment
        fetch('http://localhost:8000/api/payment/capture-payment', {
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
    <div>
      <div>
        <label>User ID: </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div>
        <label>Amount: </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button onClick={initiatePayment}>Pay Now</button>
    </div>
  );
}

export default App;
