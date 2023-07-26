import { Request, Response } from "express";
import { UserModel } from "../schemas";

class UserController {
    async show(req: Request, res: Response) {
        const id: string = req.params.id;
        try {
            const user = await UserModel.findById(id).exec();
            if (!user) {
                return res.status(404).json({
                    message: "Not found"
                });
            }
            res.json(user);
        } catch (err) {
            console.log("Error fetching user:", err);
            res.status(500).json({ error: "Error fetching user." });
        }
    }

    async getMe() {
        // TODO: сделать возвращение инфы о себе
    }

    async create(req: Request, res: Response) {
        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password,
        };

        try {
            const user = new UserModel(postData);
            const savedUser = await user.save();
            res.status(201).json(savedUser);
        } catch (err) {
            console.log("Error saving user:", err);
            res.status(500).json({ error: "Error saving user." });
        }
    }

    async delete(req: Request, res: Response) {
        const id: string = req.params.id;
        try {
            const user = await UserModel.findByIdAndRemove(id).exec();
            if (!user) {
                return res.status(404).json({
                    message: "Not found"
                });
            }
            res.json({
                message: `User ${user.fullname} removed`
            });
        } catch (err) {
            console.log("Error fetching user:", err);
            res.status(500).json({ error: "Error fetching user." });
        }
    }
}

export default UserController;
