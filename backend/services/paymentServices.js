import Razorpay from 'razorpay';
import Transaction from '../models/transaction.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Service function to create a payment order
export const createPaymentOrder = async (amount, userId) => {
  try {
 
    const options = {
      amount:amount,  // Razorpay expects the amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt:'1234',
      notes: {
        description: 'Payment for Order',
      },
    };

    

    // Create an order with Razorpay API
    const order = await razorpay.orders.create(options);
console.log(order,"order")
    // Save the transaction details in the database
    const transaction = new Transaction({
      userId:userId,
      amount,
      status: 'pending',  // Initially, the payment status is 'pending'
      razorpayPaymentId: order.id,
      transactionId: order.receipt,
    });

    // Save transaction to DB
    await transaction.save();
    return order;  // Return the Razorpay order details for the controller
  } catch (error) {
    console.error(error);
    throw new Error('Error creating payment order');
  }
};

export const capturePayment = async (paymentId, orderId, amount) => {
    try {
      
      const capture = await razorpay.payments.capture(paymentId, orderId, amount);
      console.log("capturing",capture);
      const transaction = await Transaction.findOneAndUpdate(
        { razorpayPaymentId: paymentId },
        { status: 'completed' },
        { new: true }
      );
  console.log("transaction",transaction)
      return capture;  // Return the capture details to the controller
    } catch (error) {
      console.error(error);
      throw new Error('Error capturing payment');
    }
  };

  

  
