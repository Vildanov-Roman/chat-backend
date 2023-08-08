import { NextFunction, Request, Response } from "express";
import { verifyJWTToken } from "../utils";
import { IUser } from "../models/User";

interface RequestCustom extends Request {
    user?: IUser;
    headers: {
        token?: string;
    };
}

export default async (req: RequestCustom, res: Response, next: NextFunction) => {
if (req.path === '/user/login' || req.path === '/user/registration') {
    return next();
}

    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({ message: "No auth token provided" });
    }

    try {
        const user = await verifyJWTToken(token) as IUser;
        req.user = user; 
        next();
    } catch (error) {
        console.log("Error updating user:", error);
        return res.status(403).json({ message: "Invalid auth token provided" });
    }
};
