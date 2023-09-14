import { Request, Response } from 'express';
import UserModel from './user.schema.js'; // userModel nomini faylni joyini o'zgartiring
import Chance from 'chance'; // Chance kutubxonasini o'rnating
import { JWT } from '../../utils/jwt.js';
const chance = new Chance();
class UserController {
    // Ma'lumotlarni olish 
    async getUsers(req: Request, res: Response) {
        try {
            const users = await UserModel.find();
            res.status(201).send({
                success: true,
                data: users
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async createUser(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const username = chance.word();
            const user = new UserModel({ username, email });
            await user.save();
            let token = JWT.SIGN({ id: user._id, role: "user" } as Object);
            res.status(201).send({
                success: true,
                token,
                data: user
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async createAdmin(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const username = chance.word();
            const user = new UserModel({ username, email });
            await user.save();
            let token = JWT.SIGN({ id: user._id, role: "admin" } as Object);
            res.status(201).send({
                success: true,
                token,
                data: user
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    // Ma'lumotlarni yangilash
    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { username, email } = req.body;
            const updatedUser = await UserModel.findByIdAndUpdate(id, { username, email }, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
            }
            res.status(201).send({
                success: true,
                data: updatedUser
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    // Ma'lumotlarni o'chirish
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedUser = await UserModel.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
            }
            res.status(201).send({
                success: true,
                data: deletedUser
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default UserController;
