import express from 'express';
import PostController from './post.contr.js';

const postRouter = express.Router();
const controller = new PostController();

// CREATE POST
postRouter.post('/', controller.createPost);

// GET ALL POSTS
postRouter.get('/', controller.getPosts);
postRouter.get('/bought', controller.getMyPosts);
postRouter.get('/:id', controller.getPostId);

// LIKE POST
postRouter.patch('/like/:id', controller.likePost);

// DISLIKE POST
postRouter.patch('/dislike/:id', controller.dislikePost);

// UPDATE POST
postRouter.put('/:id', controller.updatePost);

// DELETE POST
postRouter.delete('/:id', controller.deletePost);

export default postRouter;
