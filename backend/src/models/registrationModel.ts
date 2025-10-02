import mongoose, { Schema, Document } from "mongoose";
import { EventStatus, RegistrationStatus } from "../types/eventTypes";

export interface IRegistration extends Document {
  student: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  status: RegistrationStatus;
  isVolunteer: boolean;
}

const registrationSchema = new Schema<IRegistration>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: {
      type: String,
      enum: Object.values(RegistrationStatus),
      default: RegistrationStatus.PENDING,
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
