import { Request, Response } from 'express';
import braintree from 'braintree';
import { JWT } from '../../utils/jwt.js';
import PostModel from '../posts/post.schema.js';

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID as string,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY as string,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY as string,
});

class PaymentController {
  async generateClientToken(req: Request, res: Response) {
    try {
      const clientToken = await gateway.clientToken.generate({});
      res.status(200).json({ clientToken: clientToken.clientToken });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  async processPayment(req: Request, res: Response) {
    try {
      const { paymentMethodNonce, amount, postId } = req.body;
      let token = req.headers.token as string;

      // userId ni olish
      const userId = JWT.VERIFY(token).id;

      // To'lovni amalga oshirish
      const saleResult = await gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: paymentMethodNonce,
        options: {
          submitForSettlement: true,
        },
      });

      if (saleResult.success) {
        // To'lov muvaffaqiyatli amalga oshirilgan
        const transactionId = saleResult.transaction.id;
        await PostModel.findByIdAndUpdate(postId, { $set: { userId: userId, transactionId: transactionId } });
        const numberOfBuyers = await PostModel.count({ transactionId: { $exists: true } });

        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, message: 'To\'lov amalga oshirilmadi' });
      }
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

}

export default PaymentController;
