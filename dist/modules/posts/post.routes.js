import express from 'express';
import PostController from './post.contr.js';
import authMiddleware from '../../middleware/auth.js';
import adminaCheck from '../../middleware/adminCheck.js';
const postRouter = express.Router();
const controller = new PostController();
// CREATE POST
postRouter.post('/', adminaCheck, controller.createPost);
// GET ALL POSTS
postRouter.get('/', controller.getPosts);
postRouter.get('/bought', authMiddleware, controller.getMyPosts);
postRouter.get('/sale/posts', adminaCheck, controller.getPurchasedPosts);
postRouter.get('/:id', controller.getPostId);
// LIKE POST
postRouter.patch('/like/:id', authMiddleware, controller.likePost);
// DISLIKE POST
postRouter.patch('/dislike/:id', authMiddleware, controller.dislikePost);
// UPDATE POST
postRouter.put('/:id', adminaCheck, controller.updatePost);
// DELETE POST
postRouter.delete('/:id', adminaCheck, controller.deletePost);
export default postRouter;
