import express from 'express';
import { createPaymentOrderController, capturePaymentController} from '../controllers/paymentController.js';

const router = express.Router();

// Define routes and associate them with controller functions
router.post('/create-order', createPaymentOrderController);
router.post('/capture-payment', capturePaymentController);

export default router;
