import {
  createPaymentOrder,
  capturePayment,
} from "../services/paymentServices.js";
import { createUserAccount } from "../services/userServices.js";
import mongoose from "mongoose";

// Create a payment order
export const createPaymentOrderController = async (req, res) => {
  const {  userId,amount} = req.body;
  console.log( req.body," req.body");
  try {
    const order = await createPaymentOrder(amount, userId);
    console.log(order);
    if (order && order.id && order.amount) {
      res.status(200).json({
        id: order.id,
        amount: order.amount,
      });
    } else {
      res.status(400).json({ message: 'Invalid order data received' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating payment order" });
  }
};

// Capture the payment
export const capturePaymentController = async (req, res) => {
  const { payment_id, order_id, amount } = req.body;

  try {
    // Capture payment
    const capture = await capturePayment(payment_id, order_id, amount);
    res.status(200).json({ status: "Payment captured successfully", capture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error capturing payment" });
  }
};
// Create a user account
export const createUserAccountController = async (req, res) => {
  const { oauthId, email, name } = req.body;
  console.log(req.body);

  try {
    const user = await createUserAccount(oauthId, email, name);
    res.status(201).json({ message: "User account created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user account" });
  }
};