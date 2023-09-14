var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JWT } from '../utils/jwt.js';
export default function adminaCheck(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let token = req.headers.token;
            let role = JWT.VERIFY(token).role;
            if (role === "admin") {
                next();
            }
            else {
                throw Error("Are you bot? only admin is allowed to access!!!");
            }
        }
        catch (error) {
            console.error(error.message);
            return res.status(401).json({ message: error.message, status: 401 });
        }
    });
}
