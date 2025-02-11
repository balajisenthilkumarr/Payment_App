import express from 'express';
import { createPaymentOrderController, capturePaymentController,getTransactionsController} from '../controllers/paymentController.js';

const router = express.Router();

// Define routes and associate them with controller functions
router.post('/create-order', createPaymentOrderController);
router.post('/capture-payment', capturePaymentController);
router.get('/get-Transaction/:useremail',getTransactionsController)

export default router;
