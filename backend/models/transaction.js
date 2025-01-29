import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId:  {type: String, required: true},
  amount: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  razorpayOrderId: { type: String },
  transactionId: { type: String },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
