import mongoose, { Schema, Document } from "mongoose";
import { Roles } from "../types/userTypes";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
  faculty: string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: Object.values(Roles), required: true },
  faculty: { type: String, required: true },
});

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
