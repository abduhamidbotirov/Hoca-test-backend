var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CommentModel from './comment.schema.js'; // CommentModel
import { JWT } from '../../utils/jwt.js';
import PostModel from '../posts/post.schema.js';
class CommentController {
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                // userId ni olish
                const userId = JWT.VERIFY(token).id;
                const { text, postId } = req.body; // Comment qo'shish uchun text va postId
                if (!text || !postId) {
                    return res.send({
                        success: false,
                        message: 'text and postId required!'
                    });
                }
                const comment = new CommentModel({ text, postId, user: userId, like: 0, dislike: 0, likedBy: [], dislikedBy: [] });
                yield comment.save();
                let pushComment = yield PostModel.findById(postId);
                pushComment === null || pushComment === void 0 ? void 0 : pushComment.comments.push(comment._id);
                yield (pushComment === null || pushComment === void 0 ? void 0 : pushComment.save());
                res.status(201).send({
                    success: true,
                    data: comment.populate('user')
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield CommentModel.find();
                res.status(201).send({
                    success: true,
                    data: comments
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    likeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const comment = yield CommentModel.findById(id);
                if (!comment) {
                    return res.status(404).json({ error: 'Comment topilmadi' });
                }
                let token = req.headers.token;
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
                }
                else {
                    // Agar user avval like qilgan bo'lsa, like ni o'chiramiz
                    const indexOfLike = comment.likedBy.indexOf(userId);
                    comment.likedBy.splice(indexOfLike, 1); // Like ni o'chiramiz
                    comment.like -= 1; // Like sonini kamaytiramiz
                }
                yield comment.save();
                res.status(201).send({
                    success: true,
                    data: comment
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    dislikeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const comment = yield CommentModel.findById(id);
                if (!comment) {
                    return res.status(404).json({ error: 'Comment topilmadi' });
                }
                let token = req.headers.token;
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
                }
                else {
                    // Agar user avval dislike qilgan bo'lsa, dislike ni o'chiramiz
                    const indexOfDislike = comment.dislikedBy.indexOf(userId);
                    comment.dislikedBy.splice(indexOfDislike, 1); // Dislike ni o'chiramiz
                    comment.dislike -= 1; // Dislike sonini kamaytiramiz
                }
                yield comment.save();
                res.status(201).send({
                    success: true,
                    data: comment
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { text } = req.body;
                const updatedComment = yield CommentModel.findByIdAndUpdate(id, { text }, { new: true });
                if (!updatedComment) {
                    return res.status(404).json({ error: 'Comment topilmadi' });
                }
                res.status(201).send({
                    success: true,
                    data: updatedComment
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deletedComment = yield CommentModel.findByIdAndDelete(id);
                if (!deletedComment) {
                    return res.status(404).json({ error: 'Comment topilmadi' });
                }
                res.status(201).send({
                    success: true,
                    data: deletedComment
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
export default CommentController;
