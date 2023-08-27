import { Request, Response } from "express";
import { UserModel } from "../models";
import { createJWTToken } from "../utils";
import bcrypt from "bcrypt"
import { Server as SocketServer, Socket } from "socket.io";
import { IUser } from "../models/User";

class UserController {
    io: SocketServer

    constructor(io: SocketServer) {
        this.io = io;
    }

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

    async getMe (req: Request, res: Response): Promise<void> {
        const id: string = (req as any).user?._id; // Use type assertion if necessary
      
        try {
          const user = await UserModel.findById(id).exec();
      
          if (!user) {
            res.status(404).json({
              message: "User not found",
            });
          }
      
          res.json(user);
        } catch (err) {
          console.log("Error fetching user:", err);
          res.status(500).json({ error: "Error fetching user." });
        }
      };
    

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

    async login(req: Request, res: Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password
        };
    
        try {
            const user = await UserModel.findOne({ email: postData.email }).exec();
    
            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "User not found"
                });
            }
    
            if (bcrypt.compareSync(postData.password, user.password)) {
                const token = createJWTToken(postData);
                res.json({
                    status: "success",
                    token
                });
            } else {
                res.json({
                    status: "error",
                    message: "Incorrect password or email"
                });
            }
        } catch (error) {
            console.log("Error fetching user:", error);
            res.status(500).json({ error: "Error fetching user." });
        }
    }
    
}

export default UserController;
