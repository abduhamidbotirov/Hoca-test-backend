import express from "express";
import userRouter from "./users/user.routes.js";
const router = express.Router();
router.use('/test', () => { });
router.use('/users', userRouter)
export default router;