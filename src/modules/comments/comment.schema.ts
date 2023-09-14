import mongoose, { Schema, Document } from 'mongoose';
import { IComment } from '../../interface/interface';
const commentSchema = new Schema<IComment>(
    {
        text: {
            type: String,
            required: true,
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        like: {
            type: Number,
            default: 0,
        },
        dislike: {
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

const CommentModel = mongoose.model<IComment>('Comment', commentSchema);

export default CommentModel 
