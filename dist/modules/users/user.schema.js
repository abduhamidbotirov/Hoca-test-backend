import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
const userSchema = new Schema({
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
            validator: (value) => validator.isEmail(value),
            message: 'Noto\'g\'ri email formati',
        },
    },
}, { timestamps: true });
const UserModel = mongoose.model('User', userSchema);
export default UserModel;
