import { Request, Response } from 'express';
import PostModel from './post.schema.js';
import { v4 as uuidv4 } from 'uuid';
import uploader from '../../utils/cloudinary.js';
import { UploadedFile } from 'express-fileupload';
import { JWT } from '../../utils/jwt.js';
class PostController {
    async createPost(req: Request, res: Response) {
        try {
            // Faylni tekshirish
            if (!req.files || !req.files.file) {
                return res.status(400).json({ error: 'Fayl topilmadi' });
            }
            const contentType = req.headers['content-type'];
            if (!contentType || !contentType.includes('multipart/form-data')) {
                return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
            }
            const fileType: UploadedFile | any = req.files.file;

            // Fayl turi "image/" bilan boshlansa, tekshirishni bajarish
            if (!fileType.mimetype.startsWith('image/')) {
                return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
            }
            const { title, desc, price } = req.body;
            // Generating a unique name using uuid
            const unique_image_name = uuidv4();
            // Uploading the image to Cloudinary
            const imgLink = await uploader(fileType.data, unique_image_name);

            const post = new PostModel({ imgLink, title, desc, price, like: 0, dislike: 0 });
            await post.save();

            res.status(201).send({
                success: true,
                data: post
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async getMyPosts(req: Request, res: Response) {
        try {
            let token = req.headers.token as string;
            const userId = JWT.VERIFY(token).id;
            const myPosts = await PostModel.find({ userId: userId });
            res.status(200).json({ success: true, data: myPosts });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async getPurchasedPosts(req: Request, res: Response) {
        try {
            const purchasedPosts = await PostModel.find({ transactionId: { $exists: true } });
            res.status(200).json({ success: true, data: purchasedPosts });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async getPosts(req: Request, res: Response) {
        try {
            const posts = await PostModel.find().populate({
                path: "comments",
                populate: {
                    path: "user",
                }
            });
            res.status(201).send({
                success: true,
                data: posts
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async getPostId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const post = await PostModel.findById(id);
            res.status(201).send({
                success: true,
                data: post
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async likePost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const post = await PostModel.findById(id);
            if (!post) {
                return res.status(404).json({ error: 'Post topilmadi' });
            }
            let token = req.headers.token as string

            // userId ni olish
            const userId = JWT.VERIFY(token).id;

            // Agar user postni avval like qilmagan bo'lsa, yangi like qo'shamiz
            if (!post.likedBy.includes(userId)) {
                post.likedBy.push(userId);
                post.like += 1; // Like sonini oshiramiz

                // Agar user avval dislike qilgan bo'lsa, dislike ni o'chiramiz
                if (post.dislikedBy.includes(userId)) {
                    const indexOfDislike = post.dislikedBy.indexOf(userId);
                    post.dislikedBy.splice(indexOfDislike, 1); // Dislike ni o'chiramiz
                    post.dislike -= 1; // Dislike sonini kamaytiramiz
                }
            } else {
                // Agar user avval like qilgan bo'lsa, like ni o'chiramiz
                const indexOfLike = post.likedBy.indexOf(userId);
                post.likedBy.splice(indexOfLike, 1); // Like ni o'chiramiz
                post.like -= 1; // Like sonini kamaytiramiz
            }

            await post.save();

            res.status(201).send({
                success: true,
                data: post
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async dislikePost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const post = await PostModel.findById(id);
            if (!post) {
                return res.status(404).json({ error: 'Post topilmadi' });
            }
            let token = req.headers.token as string

            // userId ni olish
            const userId = JWT.VERIFY(token).id;

            // Agar user postni avval dislike qilmagan bo'lsa, yangi dislike qo'shamiz
            if (!post.dislikedBy.includes(userId)) {
                post.dislikedBy.push(userId);
                post.dislike += 1; // Dislike sonini oshiramiz

                // Agar user avval like qilgan bo'lsa, like ni o'chiramiz
                if (post.likedBy.includes(userId)) {
                    const indexOfLike = post.likedBy.indexOf(userId);
                    post.likedBy.splice(indexOfLike, 1); // Like ni o'chiramiz
                    post.like -= 1; // Like sonini kamaytiramiz
                }
            } else {
                // Agar user avval dislike qilgan bo'lsa, dislike ni o'chiramiz
                const indexOfDislike = post.dislikedBy.indexOf(userId);
                post.dislikedBy.splice(indexOfDislike, 1); // Dislike ni o'chiramiz
                post.dislike -= 1; // Dislike sonini kamaytiramiz
            }

            await post.save();

            res.status(201).send({
                success: true,
                data: post
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async updatePost(req: Request, res: Response) {
        try {
            // Faylni tekshirish
            const { id } = req.params;
            const { title, desc, price } = req.body;
            if (!req.files || !req.files.file) {
                const updatedPost = await PostModel.findByIdAndUpdate(id, { title, desc, price }, { new: true });
                if (!updatedPost) {
                    return res.status(404).json({ error: 'Post topilmadi' });
                }
                res.status(201).send({
                    success: true,
                    data: updatedPost
                });
            } else {
                const contentType = req.headers['content-type'];
                if (!contentType || !contentType.includes('multipart/form-data')) {
                    return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
                }
                const fileType: UploadedFile | any = req.files.file;

                // Fayl turi "image/" bilan boshlansa, tekshirishni bajarish
                if (!fileType.mimetype.startsWith('image/')) {
                    return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
                }
                // Generating a unique name using uuid
                const unique_image_name = uuidv4();
                // Uploading the image to Cloudinary
                const imgLink = await uploader(fileType.data, unique_image_name);

                const updatedPost = await PostModel.findByIdAndUpdate(id, { imgLink, title, desc, price }, { new: true });
                if (!updatedPost) {
                    return res.status(404).json({ error: 'Post topilmadi' });
                }
                res.status(201).send({
                    success: true,
                    data: updatedPost
                });
            }

        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async deletePost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedPost = await PostModel.findByIdAndDelete(id);
            if (!deletedPost) {
                return res.status(404).json({ error: 'Post topilmadi' });
            }
            res.status(201).send({
                success: true,
                data: deletedPost
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

}

export default PostController;
