import { Schema, Document, Model, model } from 'mongoose';

// Interface to describe the fields in the User model
interface IUser extends Document {
    email: string;
    password: string;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema({
    email: String,
    password: String
});

// Define the model
const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
