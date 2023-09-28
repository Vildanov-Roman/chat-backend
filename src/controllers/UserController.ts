import { Request, Response } from "express";
import { UserModel } from "../models";
import { createJWTToken } from "../utils";
import bcrypt from "bcrypt"
import { Server as SocketServer, Socket } from "socket.io";
import { validationResult, Result, ValidationError } from "express-validator";
import { IUser } from "../models/User";
import mailer from "../core/mailer";
import { SentMessageInfo } from "nodemailer/lib/sendmail-transport";

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

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
          } else {
            const user = new UserModel(postData);
      
            user
              .save()
              .then((obj: IUser) => {
                res.json(obj);
                mailer.sendMail(
                  {
                    from: "admin@test.com",
                    to: postData.email,
                    subject: "Подтверждение почты React Chat Tutorial",
                    html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:3000/signup/verify?hash=${obj.confirm_hash}">по этой ссылке</a>`,
                  },
                  function (err: Error | null, info: SentMessageInfo) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(info);
                    }
                  }
                );
              })
              .catch((reason) => {
                res.status(500).json({
                  status: "error",
                  message: reason,
                });
              });
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

    async verify(req: Request, res: Response) {
      const hash: any = req.query.hash;
    
      try {
        if (!hash) {
          return res.status(422).json({ errors: "Invalid hash" });
        }
    
        const user = await UserModel.findOne({ confirm_hash: hash });
    
        if (!user) {
          return res.status(404).json({
            status: "error",
            message: "Hash not found",
          });
        }
    
        user.confirmed = true;
        await user.save();
    
        res.json({
          status: "success",
          message: "Аккаунт успешно подтвержден!",
        });
      } catch (err) {
        return res.status(500).json({
          status: "error",
          message: "Error fetching user",
        });
      }
    };

    async login(req: Request, res: Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password
        };
    
        try {
            const user = await UserModel.findOne({ email: postData.email }).exec();
    
            if (!user) {
                return res.status(422).json({
                    errorr: "Invalid hash"
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
