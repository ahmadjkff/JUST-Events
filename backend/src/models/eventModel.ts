import mongoose, { Schema, Document } from "mongoose";
import { EventStatus } from "../types/eventTypes";

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId;
  status: EventStatus;
  feedback: {
    student: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
  }[];
  volunteers: mongoose.Types.ObjectId[];
}

const feedbackSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true, minlength: 3 },
    description: { type: String, required: true, trim: true, minlength: 10 },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.PENDING,
    },
    feedback: [feedbackSchema],
    volunteers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });
eventSchema.index({ createdBy: 1 });

export const eventModel = mongoose.model<IEvent>("Event", eventSchema);

export default eventModel;
