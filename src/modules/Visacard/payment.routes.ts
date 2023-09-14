import express from 'express';
import PaymentController from './payment.controller.js';

const paymentRouter = express.Router();
const controller = new PaymentController();

paymentRouter.get('/client-token', controller.generateClientToken);
paymentRouter.post('/process-payment', controller.processPayment);
export default paymentRouter;