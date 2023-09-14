import express from 'express';
import PaymentController from './payment.controller.js';
import authMiddleware from '../../middleware/auth.js';

const paymentRouter = express.Router();
const controller = new PaymentController();

paymentRouter.get('/client-token', authMiddleware, controller.generateClientToken);
paymentRouter.post('/process-payment', authMiddleware, controller.processPayment);
export default paymentRouter;