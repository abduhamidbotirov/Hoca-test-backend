import mongoose, { Document, Schema, Model } from 'mongoose';
import { IPost } from '../../interface/interface';

const postSchema = new Schema<IPost>(
    {
        imgLink: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        desc: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        transactionId: { // To'lov amalga oshirilgandan so'ng to'lovni identifikatori
            type: String,
        },
        userId: { // Xaridor identifikatori
            type: String,
            ref:"User"
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment', // Comment modeliga havola
            },
        ],
        like: {
            type: Number,
            default: 0, // Boshlang'ich qiymat
        },
        dislike: {
            type: Number,
            default: 0, // Boshlang'ich qiymat
        },
        likedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User', // User modeliga havola
            },
        ],
        dislikedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User', // User modeliga havola
            },
        ],
    },
    { timestamps: true }
);

// Post modelini yaratish
const PostModel = mongoose.model<IPost>('Post', postSchema);

export default PostModel;
