var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserModel from './user.schema.js'; // userModel nomini faylni joyini o'zgartiring
import Chance from 'chance'; // Chance kutubxonasini o'rnating
import { JWT } from '../../utils/jwt.js';
const chance = new Chance();
class UserController {
    // Ma'lumotlarni olish 
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield UserModel.find();
                res.status(201).send({
                    success: true,
                    data: users
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const username = chance.word();
                const user = new UserModel({ username, email });
                yield user.save();
                let token = JWT.SIGN({ id: user._id, role: "user" });
                res.status(201).send({
                    success: true,
                    token,
                    data: user
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    createAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const username = chance.word();
                const user = new UserModel({ username, email });
                yield user.save();
                let token = JWT.SIGN({ id: user._id, role: "admin" });
                res.status(201).send({
                    success: true,
                    token,
                    data: user
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Ma'lumotlarni yangilash
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { username, email } = req.body;
                const updatedUser = yield UserModel.findByIdAndUpdate(id, { username, email }, { new: true });
                if (!updatedUser) {
                    return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
                }
                res.status(201).send({
                    success: true,
                    data: updatedUser
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Ma'lumotlarni o'chirish
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deletedUser = yield UserModel.findByIdAndDelete(id);
                if (!deletedUser) {
                    return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
                }
                res.status(201).send({
                    success: true,
                    data: deletedUser
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
export default UserController;
