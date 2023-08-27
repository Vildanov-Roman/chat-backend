import { Request, Response } from "express";
import { MessageModel } from "../models";
import { Server as SocketServer, Socket } from "socket.io";

class MessageController {

    io: SocketServer

    constructor(io: SocketServer) {
        this.io = io;
    }

    index = (req: Request, res: Response) => {
        const dialogId: string = req.query.dialog as string;

        MessageModel.find({ dialog: dialogId })
            .populate(['dialog'])
            .exec()
            .then((messages) => {
                if (messages.length === 0) {
                    return res.status(404).json({
                        message: "Messages not found"
                    });
                }
                return res.json(messages);
            })
            .catch((err) => {
                console.log("Error fetching messages:", err);
                return res.status(500).json({ error: "Error fetching messages." });
            });
    }

    create = async (req: any, res: Response) => {
        const userId = req.user._id;
    
        const postData = {
            text: req.body.text,
            dialog: req.body.dialog_id,
            user: userId,
        };
    
        const message = new MessageModel(postData);
    
        try {
            await message.save();
            
            const populatedMessage = await message.populate("dialog");
            
            res.json(populatedMessage);
            this.io.emit('SERVER:NEW_MESSAGE', populatedMessage);
        } catch (error) {
            res.status(500).json({ error: "Error creating message." });
        }
    }
        

    delete = (req: Request, res: Response) => {
        const id: string = req.params.id;
        
        MessageModel.findByIdAndRemove({_id: id})
            .exec()
            .then((message) => {
                if (!message) {
                    return res.status(404).json({
                        message: "Not found"
                    });
                }
                res.json({
                    message: `Message removed`
                });
            })
            .catch((err) => {
                console.log("Error deleting Message:", err);
                res.status(500).json({ error: "Error deleting Message." });
            });
    }
    
}

export default MessageController;
