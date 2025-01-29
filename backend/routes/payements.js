import express from 'express';
import { createPaymentOrderController, capturePaymentController,createUserAccountController } from '../controllers/paymentController.js';

const router = express.Router();

// Define routes and associate them with controller functions
router.post('/create-order', createPaymentOrderController);
router.post('/capture-payment', capturePaymentController);
router.post("/account",createUserAccountController);

export default router;
