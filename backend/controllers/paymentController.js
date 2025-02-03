import {
  createPaymentOrder,
  capturePayment,
transactiondata
} from "../services/paymentServices.js";

export const createPaymentOrderController = async (req, res) => {
  const { userId, amount } = req.body;
  console.log(req.body, " req.body");
  try {
    const order = await createPaymentOrder(amount, userId);
    console.log(order);
    if (order && order.id && order.amount) {
      res.status(200).json({
        id: order.id,
        amount: order.amount,
      });
    } else {
      res.status(400).json({ message: "Invalid order data received" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating payment order" });
  }
};

// Capture the payment
export const capturePaymentController = async (req, res) => {
  const { payment_id, order_id, amount } = req.body;
  console.log(payment_id);

  try {
    // Capture payment
    const capture = await capturePayment(payment_id, order_id, amount);
    res.status(200).json({ status: "Payment captured successfully", capture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error capturing payment" });
  }
};

// Backend: controllers/transactionController.js
export const getTransactionsController = async (req, res) => {
  const { userId } = req.params; // Get userId from URL params
  console.log("user data from",userId);

  try {
      const transactions = await transactiondata({userId });
          
      res.status(200).json(transactions);
  } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: "Error fetching transactions" });
  }
};
