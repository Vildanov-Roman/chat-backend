import { Request, Response } from "express";
import { DialogModel, MessageModel } from "../models";

class DialogController {
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

    create = (req: Request, res: Response): void => {
        const postData = {
          author: req.params.id,
          partner: req.body.partner,
        };
    
        DialogModel.findOne(
          {
            author: req.params.id,
            partner: req.body.partner,
          },
          (err: any, dialog: any) => {
            if (err) {
              return res.status(500).json({
                status: 'error',
                message: err,
              });
            }
            if (dialog) {
              return res.status(403).json({
                status: 'error',
                message: 'Такой диалог уже есть',
              });
            } else {
              const dialog = new DialogModel(postData);
    
              dialog
                .save()
                .then((dialogObj) => {
                  const message = new MessageModel({
                    text: req.body.text,
                    user: req.params.id,
                    dialog: dialogObj._id,
                  });
    
                  message
                    .save()
                    .then(() => {
                      dialogObj.lastMessage = message._id;
                      dialogObj.save().then(() => {
                        res.json(dialogObj);
                        
                      });
                    })
                    .catch((reason) => {
                      res.json(reason);
                    });
                })
                .catch((err) => {
                  res.json({
                    status: 'error',
                    message: err,
                  });
                });
            }
          },
        );
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
