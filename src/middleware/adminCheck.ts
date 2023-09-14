import { Request, Response, NextFunction } from 'express';
import { JWT } from '../utils/jwt.js';

export default async function adminaCheck(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.headers.token as string;
        let role = JWT.VERIFY(token).role;
        if (role as string === "admin" as string) {
            next();
        } else {
            throw Error("Are you bot? only admin is allowed to access!!!")
        }
    } catch (error: any) {
        console.error(error.message);
        return res.status(401).json({ message: error.message, status: 401 });
    }
}
