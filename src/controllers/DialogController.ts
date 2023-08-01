import { Request, Response } from "express";
import { DialogModel, MessageModel } from "../models";

class DialogController {
    index(req: Request, res: Response) {
        const authorId: string = req.params.id;

        DialogModel.find({ author: authorId })
            .populate(['author', 'partner'])
            .exec()
            .then((dialogs) => {
                if (dialogs.length === 0) {
                    return res.status(404).json({
                        message: "Dialogs not found"
                    });
                }
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

    create(req: Request, res: Response) {
        const postData = {
            author: req.params.author,
            partner: req.params.partner
        };
        const dialog = new DialogModel(postData);
        dialog.save().then((dialogObj: any) => {

            const message = new MessageModel({
                text: req.body.text,
                dialog: dialogObj._id,
                user: req.body.author
            });

            message
                .save()
                .then(() => {
                    res.json(dialogObj);
                })
                .catch(reason => {
                    res.json(reason)
                });

        }).catch(reason => {
            res.json(reason)
        })
    }

    async delete(req: Request, res: Response) {
        const id: string = req.params.id;
        try {
            const dialog = await DialogModel.findByIdAndRemove(id).exec();
            if (!dialog) {
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

export default DialogController;
