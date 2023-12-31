import express from "express";
import userRouter from "./users/user.routes.js";
import postRouter from "./posts/post.routes.js";
import commentRouter from "./comments/comment.routes.js";
import paymentRouter from "./Visacard/payment.routes.js";
const router = express.Router();
router.use('/test', () => { });
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/comment', commentRouter);
router.use('/payment', paymentRouter);
export default router;
