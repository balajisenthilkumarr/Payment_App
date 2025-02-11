import mongoose from 'mongoose';
import { type } from 'os';

// Transaction Schema
const transactionSchema = new mongoose.Schema({
 Receiverid:  { type: String, required: true } , // Link to the User model (Receiver)
 Senderid:{type:String,require:true},
  amount: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  razorpayOrderId: { type: String },
  transactionId: { type: String },
}, { timestamps: true }); // Optional: Adds `createdAt` and `updatedAt` fields

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
