import { NextFunction, Request, Response } from "express";
import { verifyJWTToken } from "../utils";
import { IUser } from "../models/User";

// interface RequestCustom extends Request {
//     user?: IUser;
//     headers: {
//         token?: string;
//     };
// }

export default async (req: any, res: Response, next: NextFunction) => {
  if (
    req.path === "/user/signin" ||
    req.path === "/user/signup" ||
    req.path === "/user/verify"
  ) {
    return next();
  }

  const token: any = req.headers.token;

  verifyJWTToken(token)
    .then((user: any) => {
      req.user = user.data._doc;
      next();
    })
    .catch((err) => {
      res.status(403).json({
        message: "Invalid auth token provided",
      });
    });

  // if (!token) {
  //     return res.status(403).json({ message: "No auth token provided" });
  // }

  // try {
  //     const user = await verifyJWTToken(token) as IUser;
  //     console.log(user);

  //     req.user = user;
  //     next();
  // } catch (error) {
  //     console.log("Error updating user:", error);
  //     return res.status(403).json({ message: "Invalid auth token provided" });
  // }
};
