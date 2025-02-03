import { CONFIG } from "../config/overrides";
//console.log(CONFIG.API_URL,"ssssssssssss");

  export const createOrder = async (userId, amount) => {
    console.log("Creating order for:", userId, amount);
    const response = await fetch(`${CONFIG.API_URL}/payment/create-order`, {
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
    const response = await fetch(`${CONFIG.API_URL}/payment/capture-payment`, {
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
  export const getTransactionDetails = async (userId) => {
    const response = await fetch(`${CONFIG.API_URL}/payment/get-Transaction/${userId}`, {
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
      },
    });
        if(!response.ok){
          throw new Error("Get transaction details failed");
        }
    return response.json();
  };