import express from 'express';
import CommentController from './comment.contr.js'; // CommentController
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();
const commentController = new CommentController();

// Comment yaratish
router.post('/',authMiddleware, commentController.createComment);

// Barcha commentlarni olish
router.get('/', commentController.getComments);

// Commentga like qo'shish
router.patch('/like/:id',authMiddleware, commentController.likeComment);

// Commentga dislike qo'shish
router.patch('/dislike/:id',authMiddleware, commentController.dislikeComment);

// Commentni yangilash
router.put('/:id',authMiddleware, commentController.updateComment);

// Commentni o'chirish
router.delete('/:id',authMiddleware, commentController.deleteComment);

export default router;
