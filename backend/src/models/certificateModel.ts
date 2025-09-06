import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  student: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  issueDate: Date;
}

const certificateSchema = new Schema<ICertificate>({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  issueDate: { type: Date, default: Date.now },
});

export const certificateModel = mongoose.model<ICertificate>(
  "Certificate",
  certificateSchema
);
