import mongoose, { Schema, Document } from "mongoose";
import {
  EventCategory,
  EventDepartment,
  EventStatus,
} from "../types/eventTypes";

export interface IVolunteer {
  student: mongoose.Types.ObjectId;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId;
  status: EventStatus;
  category: EventCategory;
  department: EventDepartment;
  feedback: {
    student: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
  }[];
  volunteers: IVolunteer[];
  registeredStudents: mongoose.Types.ObjectId[];
  img: string;
}

const feedbackSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const volunteerSchema = new Schema<IVolunteer>({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

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
    category: {
      type: String,
      enum: Object.values(EventCategory),
      required: true,
      default: EventCategory.OTHER,
    },
    department: {
      type: String,
      enum: Object.values(EventDepartment),
      required: true,
    },
    feedback: [feedbackSchema],
    volunteers: [volunteerSchema],
    registeredStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    img: { type: String, required: true },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });
eventSchema.index({ createdBy: 1 });

export const eventModel = mongoose.model<IEvent>("Event", eventSchema);

export default eventModel;
