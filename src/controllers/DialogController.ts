import { Request, Response } from "express";
import { DialogModel, MessageModel } from "../models";
import { Server as SocketServer, Socket } from "socket.io";

class DialogController {

  io: SocketServer

    constructor(io: SocketServer) {
        this.io = io;
    }
    
    index = (req: Request, res: Response): void => {
        
        const userId: string = req.params.id;        

        DialogModel.find()
            .or([{authorId: userId}, {partnerId: userId}])
            .populate(['author', 'partner'])
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'user',
                },
            })
            .exec()
            .then((dialogs) => {
                if (dialogs.length === 0) {
                    return res.status(404).json({
                        message: "Dialogs not found"
                    });
                }
                console.log(dialogs);
                
                return res.json(dialogs);
            })
            .catch((err) => {
                console.log("Error fetching dialogs:", err);
                return res.status(500).json({ error: "Error fetching dialogs." });
            });
    }

    // async getMe() {
    //     // TODO: сделать возвращение инфы о себе
    // }

    create = async (req: Request, res: Response) => {
      try {
          const { author, partner } = req.body;

          // Check if a dialog already exists between the users
          const existingDialog = await DialogModel.findOne({
              $or: [
                  { author, partner },
                  { author: partner, partner: author }
              ]
          }).exec();

          if (existingDialog) {
              return res.status(400).json({
                  message: "Dialog already exists between users"
              });
          }

          // If no existing dialog, create a new one
          const dialog = new DialogModel({ author, partner });
          const savedDialog = await dialog.save();

          return res.status(201).json(savedDialog);
      } catch (error) {
          console.error("Error creating dialog:", error);
          return res.status(500).json({ error: "Error creating dialog" });
      }
  };
    
      delete = (req: Request, res: Response): void => {
        const id: string = req.params.id;
        DialogModel.findOneAndRemove({ _id: id })
          .then((dialog) => {
            if (dialog) {
              res.json({
                message: `Dialog deleted`,
              });
            }
          })
          .catch(() => {
            res.json({
              message: `Dialog not found`,
            });
          });
      };
    
}

export default DialogController;
