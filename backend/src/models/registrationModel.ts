import mongoose, { Schema, Document } from "mongoose";
import { EventStatus } from "../types/eventTypes";

export interface IRegistration extends Document {
  student: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  status: EventStatus;
  isVolunteer: boolean;

}

const registrationSchema = new Schema<IRegistration>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.PENDING,
    },
    isVolunteer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

registrationSchema.index({ student: 1, event: 1 }, { unique: true });

export const RegistrationModel = mongoose.model<IRegistration>(
  "Registration",
  registrationSchema
);

export default RegistrationModel;
