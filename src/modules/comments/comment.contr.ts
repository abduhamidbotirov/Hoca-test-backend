import { Request, Response } from 'express';
import CommentModel from './comment.schema.js'; // CommentModel
import { JWT } from '../../utils/jwt.js';
import PostModel from '../posts/post.schema.js';
import { IPost } from '../../interface/interface.js';
class CommentController {
    async createComment(req: Request, res: Response) {
        try {
            let token = req.headers.token as string
            // userId ni olish
            const userId = JWT.VERIFY(token).id;
            const { text, postId } = req.body; // Comment qo'shish uchun text va postId
            if (!text || !postId) {
                return res.send({
                    success: false,
                    message: 'text and postId required!'
                })
            }
            const comment = new CommentModel({ text, postId, user: userId, like: 0, dislike: 0, likedBy: [], dislikedBy: [] });
            await comment.save();
            let pushComment: IPost | null = await PostModel.findById(postId);
            pushComment?.comments.push(comment._id)
            await pushComment?.save();
            res.status(201).send({
                success: true,
                data: comment.populate('user')
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async getComments(req: Request, res: Response) {
        try {
            const comments = await CommentModel.find();
            res.status(201).send({
                success: true,
                data: comments
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async likeComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const comment = await CommentModel.findById(id);
            if (!comment) {
                return res.status(404).json({ error: 'Comment topilmadi' });
            }
            let token = req.headers.token as string

            // userId ni olish
            const userId = JWT.VERIFY(token).id;

            // Agar user commentni avval like qilmagan bo'lsa, yangi like qo'shamiz
            if (!comment.likedBy.includes(userId)) {
                comment.likedBy.push(userId);
                comment.like += 1; // Like sonini oshiramiz

                // Agar user avval dislike qilgan bo'lsa, dislike ni o'chiramiz
                if (comment.dislikedBy.includes(userId)) {
                    const indexOfDislike = comment.dislikedBy.indexOf(userId);
                    comment.dislikedBy.splice(indexOfDislike, 1); // Dislike ni o'chiramiz
                    comment.dislike -= 1; // Dislike sonini kamaytiramiz
                }
            } else {
                // Agar user avval like qilgan bo'lsa, like ni o'chiramiz
                const indexOfLike = comment.likedBy.indexOf(userId);
                comment.likedBy.splice(indexOfLike, 1); // Like ni o'chiramiz
                comment.like -= 1; // Like sonini kamaytiramiz
            }

            await comment.save();

            res.status(201).send({
                success: true,
                data: comment
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async dislikeComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const comment = await CommentModel.findById(id);
            if (!comment) {
                return res.status(404).json({ error: 'Comment topilmadi' });
            }
            let token = req.headers.token as string

            // userId ni olish
            const userId = JWT.VERIFY(token).id;

            // Agar user commentni avval dislike qilmagan bo'lsa, yangi dislike qo'shamiz
            if (!comment.dislikedBy.includes(userId)) {
                comment.dislikedBy.push(userId);
                comment.dislike += 1; // Dislike sonini oshiramiz

                // Agar user avval like qilgan bo'lsa, like ni o'chiramiz
                if (comment.likedBy.includes(userId)) {
                    const indexOfLike = comment.likedBy.indexOf(userId);
                    comment.likedBy.splice(indexOfLike, 1); // Like ni o'chiramiz
                    comment.like -= 1; // Like sonini kamaytiramiz
                }
            } else {
                // Agar user avval dislike qilgan bo'lsa, dislike ni o'chiramiz
                const indexOfDislike = comment.dislikedBy.indexOf(userId);
                comment.dislikedBy.splice(indexOfDislike, 1); // Dislike ni o'chiramiz
                comment.dislike -= 1; // Dislike sonini kamaytiramiz
            }

            await comment.save();

            res.status(201).send({
                success: true,
                data: comment
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async updateComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { text } = req.body;
            const updatedComment = await CommentModel.findByIdAndUpdate(id, { text }, { new: true });
            if (!updatedComment) {
                return res.status(404).json({ error: 'Comment topilmadi' });
            }
            res.status(201).send({
                success: true,
                data: updatedComment
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async deleteComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedComment = await CommentModel.findByIdAndDelete(id);
            if (!deletedComment) {
                return res.status(404).json({ error: 'Comment topilmadi' });
            }
            res.status(201).send({
                success: true,
                data: deletedComment
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default CommentController;
