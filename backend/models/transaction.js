import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  razorpayPaymentId: { type: String },
  transactionId: { type: String },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
