import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/payements.js';
import connectDB from './config/db.js';
import { allowedNodeEnvironmentFlags } from 'process';
import authRoutes from './routes/logion.js';



dotenv.config();



const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/payment', router);
app.use('/api/auth', authRoutes);
connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
