import mongoose, { Schema, Document } from "mongoose";


export interface IUser extends Document {
    email: string,
    fullname: string,
    password: string,
    confirmed: Boolean,
    avatar: string,
    confirm_hash: String,
    last_seen: Date,

}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  avatar: String,
  confirm_hash: String,
  last_seen: Date,
}, {
  timestamps: true,
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
