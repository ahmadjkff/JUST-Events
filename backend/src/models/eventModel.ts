import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  registerdStudens: mongoose.Types.ObjectId[];
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  registerdStudens: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export const eventModel = mongoose.model<IEvent>("Event", eventSchema);
