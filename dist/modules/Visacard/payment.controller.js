var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import braintree from 'braintree';
import { JWT } from '../../utils/jwt.js';
import PostModel from '../posts/post.schema.js';
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
class PaymentController {
    generateClientToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientToken = yield gateway.clientToken.generate({});
                res.status(200).json({ clientToken: clientToken.clientToken });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    processPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { paymentMethodNonce, amount, postId } = req.body;
                let token = req.headers.token;
                // userId ni olish
                const userId = JWT.VERIFY(token).id;
                // To'lovni amalga oshirish
                const saleResult = yield gateway.transaction.sale({
                    amount: amount,
                    paymentMethodNonce: paymentMethodNonce,
                    options: {
                        submitForSettlement: true,
                    },
                });
                if (saleResult.success) {
                    // To'lov muvaffaqiyatli amalga oshirilgan
                    const transactionId = saleResult.transaction.id;
                    yield PostModel.findByIdAndUpdate(postId, { $set: { userId: userId, transactionId: transactionId } });
                    const numberOfBuyers = yield PostModel.count({ transactionId: { $exists: true } });
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(400).json({ success: false, message: 'To\'lov amalga oshirilmadi' });
                }
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
export default PaymentController;
