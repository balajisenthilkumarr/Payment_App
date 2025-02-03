import Razorpay from 'razorpay';
import Transaction from '../models/transaction.js';
import dotenv from 'dotenv';
import User from '../models/User.js';

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
      amount:amount*100,  // Razorpay expects the amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt:'',
      notes: {
        description: 'Payment for Order',
      },
    };

    

    // Create an order with Razorpay API
    const order = await razorpay.orders.create(options);
//console.log(order,"order")
    // Save the transaction details in the database
    const transaction = new Transaction({
      userId:userId,
      amount,
      status: 'pending',  // Initially, the payment status is 'pending'
      razorpayOrderId: order.id,
      transactionId: order.receipt,
    });

    // Save transaction to DB
    await transaction.save();
    return order;  // Return the Razorpay order details for the controller
  } catch (error) {
    console.error(error);
    throw new Error('Error creating payment order',error);
  }
};

export const capturePayment = async (paymentId, orderId, amount) => {
  try {
    // Fetch the payment details from Razorpay to check if it's already captured
    const payment = await razorpay.payments.fetch(paymentId);
    console.log(payment.status);

    if (payment.status === 'captured') {
      console.log('Payment already captured');
      // If the payment is already captured, update the database status to 'completed'
      const transaction = await Transaction.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { status: 'completed' },
        { new: true }
      );
      console.log("Transaction already captured:", transaction);
      return payment; // Return the payment data as is
    }
    const trans = await Transaction.findOne({ razorpayPaymentId: paymentId });
   console.log("db",trans);

    // If payment is not captured, proceed with the capture
    const capture = await razorpay.payments.capture(paymentId, amount);  // Correctly pass only paymentId and amount
    console.log("capturing", capture);

    // Update the transaction status to 'completed' after successful capture
    const transaction = await Transaction.findOneAndUpdate(
      { razorpayOrderId: orderId  },
      { status: 'completed' },
      { new: true }
    );
    console.log("transaction", transaction);
    return capture;  // Return the capture details to the controller
  } catch (error) {
    console.error(error);
    throw new Error('Error capturing payment');
  }
};

export const transactiondata= async({userId})=>{
 console.log("bghhg",userId);
  try{
    const transactions = await Transaction.find({userId:userId});

console.log(transactions);
    return transactions;
  }
  catch(error)
  {
    console.error(error);
    throw new Error("Error while transaction");
  }
    

}



  

  
