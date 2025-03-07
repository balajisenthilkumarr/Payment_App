import {
  createPaymentOrder,
  capturePayment,
  transactiondata
} from "../services/paymentServices.js";
import mongoose from "mongoose";
import { io, client1 , client2 , targetClient, tempclient} from '../Server.js'; 


export const createPaymentOrderController = async (req, res) => {
  const { SenderId, amount, Receiverid } = req.body;
  console.log("dddd",req.body);


  console.log(Receiverid, "Payment Initiated by", SenderId, "Amount:", amount);
  

  try {

    

    const order = await createPaymentOrder(amount, Receiverid,SenderId);
    console.log(order);
    
    if (order && order.id && order.amount) {
      res.status(200).json({
        id: order.id,
        amount: order.amount,

                
      });

      // // **Emit real-time event to Receiver & Sender**
      // const receiverSocketId = connectedUsers.get(Receiverid);
      // const senderSocketId = connectedUsers.get(Senderid);

      // if (receiverSocketId) {
      //   io.to(receiverSocketId).emit("payment_notification", {
      //     message: `You have received a payment request of ₹${amount}.`,
      //     amount,
      //     sender: Senderid
      //   });
      // }

      // if (senderSocketId) {
      //   io.to(senderSocketId).emit("payment_notification", {
      //     message: `Your payment request of ₹${amount} has been sent.`,
      //     amount,
      //     receiver: Receiverid
      //   });
      // }
    } else {
      res.status(400).json({ message: "Invalid order data received" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating payment order" });
  }
};

// **Capture the payment**
export const capturePaymentController = async (req, res) => {
  const { payment_id, order_id, amount, Receiverid, Senderid } = req.body;
  console.log("Capturing Payment:", payment_id);

  try {
    // Capture payment
    const capture = await capturePayment(payment_id, order_id, amount);
    io.to(tempclient).emit("paymentCompleted", `Your Successful Payment : ₹ ${(amount/100)} `);
    console.log(`Payment success message sent ${(amount/100)} to ${tempclient}`);

    if (tempclient === client1 && client2) {
      io.to(client2).emit("receiveMessage", `Amount received : ₹ ${(amount/100)}`);
      console.log(`receive amount message sent to ${client2}`);
    } else if ( tempclient=== client2 && client1) {
      io.to(client1).emit("receiveMessage", `Amount received : ₹ ${(amount/100)}`);
      console.log(`receive amount message sent to ${client1}`);
    }

    res.status(200).json({ status: "Payment captured successfully", capture });

    // // **Emit real-time event to Receiver & Sender**
    // const receiverSocketId = connectedUsers.get(Receiverid);
    // const senderSocketId = connectedUsers.get(Senderid);

    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("payment_notification", {
    //     message: `You have received ₹${amount} successfully.`,
    //     amount,
    //     sender: Senderid
    //   });
    // }

    // if (senderSocketId) {
    //   io.to(senderSocketId).emit("payment_notification", {
    //     message: `Your payment of ₹${amount} has been completed.`,
    //     amount,
    //     receiver: Receiverid
    //   });
    }
   catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error capturing payment" });
  }
};

// **Get transactions for a user**
export const getTransactionsController = async (req, res) => {
  const { useremail } = req.params; // Get user email from URL params
  console.log("Fetching transactions for:", useremail);

  try {
    const transactions = await transactiondata({ useremail });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};
