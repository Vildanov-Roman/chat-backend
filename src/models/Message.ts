import mongoose, { Schema, Document } from "mongoose";


export interface IMessage extends Document {
    email: string,
    fullname: string,
    password: string,
    confirmed: Boolean,
    avatar: string,
    confirm_hash: String,
    last_seen: Date,

}

const MessageSchema = new Schema({
  author: String,
  partner: String,
  text: String,
  dialog: String,
  unread: Boolean,
}, {
  timestamps: true,
});

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
