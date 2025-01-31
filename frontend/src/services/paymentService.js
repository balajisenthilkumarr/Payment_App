import { CONFIG } from "../config/overrides";
console.log(CONFIG.API_URL,"ssssssssssss");

  export const createOrder = async (userId, amount) => {
    console.log("Creating order for:", userId, amount);
    const response = await fetch(`http://localhost:5000/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, amount: parseInt(amount) }),
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.json();
  };
  
  export const capturePayment = async (paymentId, orderId, amount) => {
    const response = await fetch(`http://localhost:5000/api/payment/capture-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: paymentId,
        order_id: orderId,
        amount,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Payment capture failed');
    }
  
    return response.json();
  };