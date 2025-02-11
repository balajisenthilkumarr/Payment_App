
import { CONFIG } from "../config/overrides";
//console.log(CONFIG.API_URL,"ssssssssssss");

  export const createOrder = async (Receiverid,SenderId, amount) => {
    console.log("Creating order for:",Receiverid, SenderId, amount);
    const response = await fetch(`${CONFIG.API_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ SenderId, amount: parseInt(amount) ,Receiverid}),
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
  export const getTransactionDetails=  async (useremail)=>
  {
    console.log(" data for emaiil",useremail)
     const response=await fetch(`${CONFIG.API_URL}/payment/get-Transaction/${useremail}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if(!response.ok)
      {
        throw new Error("get transaction is failed");
      }
      
      return response.json();
  };
