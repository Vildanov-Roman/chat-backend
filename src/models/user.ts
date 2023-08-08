import mongoose, { Schema, Document } from "mongoose";
import { generatePasswordHash } from "../utils";
import { differenceInMinutes } from "date-fns";


export interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  confirmed: boolean;
  avatar: string;
  confirm_hash: string;
  last_seen: Date;
  data?: IUser;

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

UserSchema.virtual("isOnline").get(function (this: IUser) {
  const currentTime = new Date();
  return differenceInMinutes(currentTime, this.last_seen) < 5;
});


UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.pre<IUser>("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  user.password = await generatePasswordHash(user.password);
  user.confirm_hash = await generatePasswordHash(new Date().toString());
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
