import mongoose, { Schema, Document } from "mongoose";

interface IStage extends Document {
  name: string;
  location: string;
  capacity: number;
  status: string; // Example
}

const stageSchema = new Schema<IStage>({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ["free", "reserved"], required: true },
});

const stageModel = mongoose.model<IStage>("Stage", stageSchema);

export default stageModel;
