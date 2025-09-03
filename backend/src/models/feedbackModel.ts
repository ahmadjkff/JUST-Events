import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  event: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  rating?: number;
  comment?: string;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const FeedbackModel = mongoose.model<IFeedback>(
  "Feedback",
  feedbackSchema
);
