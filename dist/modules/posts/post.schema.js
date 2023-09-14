import mongoose, { Schema } from 'mongoose';
const postSchema = new Schema({
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
    transactionId: {
        type: String,
    },
    userId: {
        type: String,
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
}, { timestamps: true });
// Post modelini yaratish
const PostModel = mongoose.model('Post', postSchema);
export default PostModel;
