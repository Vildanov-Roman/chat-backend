import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models";

export default async (_: Request, res: Response, next: NextFunction) => {
    try {
        await UserModel.updateOne(
            { _id: "64c2cab9738ff55bcaf2e504" },
            { $set: { last_seen: new Date() } }
        );
        next();
    } catch (error) {
        console.log("Error updating user:", error);
        return res.status(500).json({ error: "Error updating user." });
    }
};
