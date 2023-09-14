import mongoose, { Document, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;
}
export interface IUser extends Document {
    username: string;
    email: string;
}
export interface IPost extends Document {
    imgLink: string;
    title: string;
    desc: string;
    userId?: string
    transactionId?: string;
    price: number;
    like: number;
    dislike: number;
    comments: mongoose.Types.ObjectId[]; // Comment modeliga havolalar
    likedBy: mongoose.Types.ObjectId[];
    dislikedBy: mongoose.Types.ObjectId[];

}

export interface IComment extends Document {
    text: string;
    postId: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    like: number;
    dislike: number;
    likedBy: mongoose.Types.ObjectId[];
    dislikedBy: mongoose.Types.ObjectId[];
}