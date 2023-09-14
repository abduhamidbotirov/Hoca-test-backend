import express from 'express';
import CommentController from './comment.contr.js'; // CommentController
const router = express.Router();
const commentController = new CommentController();
// Comment yaratish
router.post('/', commentController.createComment);
// Barcha commentlarni olish
router.get('/', commentController.getComments);
// Commentga like qo'shish
router.patch('/like/:id', commentController.likeComment);
// Commentga dislike qo'shish
router.patch('/dislike/:id', commentController.dislikeComment);
// Commentni yangilash
router.put('/:id', commentController.updateComment);
// Commentni o'chirish
router.delete('/:id', commentController.deleteComment);
export default router;
