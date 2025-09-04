import mongoose, { Schema, Document } from "mongoose";
import { EventStatus } from "../types/eventTypes";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId;
  status: EventStatus;
  registeredStudents: {
    student: mongoose.Types.ObjectId;
    status: EventStatus;
    registeredAt: Date;
  }[];
  feedback: {
    student: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
  }[];
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true, minlength: 3 },
    description: { type: String, required: true, trim: true, minlength: 10 },
    date: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.PENDING,
    },
    registeredStudents: [
      {
        student: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
          type: String,
          enum: Object.values(EventStatus),
          default: EventStatus.PENDING,
        },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    feedback: [
      {
        student: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });

export const eventModel = mongoose.model<IEvent>("Event", eventSchema);

export default eventModel;
