import { Request, Response } from "express";
import { MessageModel } from "../models";

class MessageController {
    index(req: Request, res: Response) {
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

    // async getMe() {
    //     // TODO: сделать возвращение инфы о себе
    // }

    create(req: Request, res: Response) {

        const userId = '64c2cab9738ff55bcaf2e504';

        const postData = {
            text: req.params.text,
            dialog: req.params.dialog_id,
            user: userId,
        };
        const message = new MessageModel(postData);

        message
            .save()
            .then((obj: any) => {
            res.json(obj)
            })
            .catch(reason => {
            res.json(reason)
        })
    }

    async delete(req: Request, res: Response) {
        const id: string = req.params.id;
        try {
            const message = await MessageModel.findByIdAndRemove(id).exec();
            if (!message) {
                return res.status(404).json({
                    message: "Not found"
                });
            }
            res.json({
                message: `Dialog removed`
            });
        } catch (err) {
            console.log("Error fetching Dialog:", err);
            res.status(500).json({ error: "Error fetching Dialog." });
        }
    }
}

export default MessageController;
