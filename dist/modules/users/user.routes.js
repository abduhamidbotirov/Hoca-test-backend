import express from 'express';
import UserController from './user.contr.js';
const router = express.Router();
const userController = new UserController();
// Foydalanuvchilarni olish
router.get('/', userController.getUsers);
// Foydalanuvchi qo'shish
router.post('/', userController.createUser);
router.post('/admin', userController.createAdmin);
// Foydalanuvchi ma'lumotlarini yangilash
router.put('/:id', userController.updateUser);
// Foydalanuvchi o'chirish
router.delete('/:id', userController.deleteUser);
export default router;
