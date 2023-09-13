import mongoose, { Document, Schema, Model } from 'mongoose';
import validator from 'validator';
import { IUser } from '../../interface/interface';

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: (value: string) => validator.isEmail(value),
                message: 'Noto\'g\'ri email formati',
            },
        },
    },
    { timestamps: true }
);
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;