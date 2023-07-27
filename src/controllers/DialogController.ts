import { Request, Response } from "express";
import { DialogModel } from "../models";

class DialogController {
    index(req: Request, res: Response) {
        const authorId: string = req.params.id;

        DialogModel.find({ author: authorId })
            .populate('dialog')
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
        dialog.save().then((obj: any) => {
            res.json(obj)
        }).catch(reason => {
            res.json(reason)
        })
    }

    // async delete(req: Request, res: Response) {
    //     const id: string = req.params.id;
    //     try {
    //         const user = await UserModel.findByIdAndRemove(id).exec();
    //         if (!user) {
    //             return res.status(404).json({
    //                 message: "Not found"
    //             });
    //         }
    //         res.json({
    //             message: `User ${user.fullname} removed`
    //         });
    //     } catch (err) {
    //         console.log("Error fetching user:", err);
    //         res.status(500).json({ error: "Error fetching user." });
    //     }
    // }
}

export default DialogController;
