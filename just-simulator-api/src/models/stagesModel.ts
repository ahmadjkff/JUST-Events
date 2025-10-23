import mongoose, { Schema, Document } from "mongoose";

const defaultHours = [
  { date: new Date(), start: "08:00", end: "10:00" },
  { date: new Date(), start: "10:00", end: "12:00" },
  { date: new Date(), start: "13:00", end: "15:00" },
  { date: new Date(), start: "15:00", end: "17:00" },
];

interface ITimeSlot {
  date: Date;
  start: string;
  end: string;
}

interface IBooking extends ITimeSlot {
  eventId: mongoose.Types.ObjectId;
}

export interface IStage extends Document {
  name: string;
  location: string;
  capacity: number;
  status: "free" | "reserved";
  freeTimes: ITimeSlot[];
  bookings: IBooking[];
}

const stageSchema = new Schema<IStage>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ["free", "reserved"], default: "free" },
  freeTimes: [
    {
      date: { type: Date, required: true },
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ],
  bookings: [
    {
      eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
      date: { type: Date, required: true },
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ],
});

stageSchema.pre("save", function (next) {
  if (!this.freeTimes || this.freeTimes.length === 0) {
    this.freeTimes = [
      { date: new Date(), start: "09:00", end: "11:00" },
      { date: new Date(), start: "11:30", end: "13:30" },
      { date: new Date(), start: "14:00", end: "16:00" },
      { date: new Date(), start: "16:30", end: "18:30" },
    ];
  }
  next();
});

const StageModel = mongoose.model<IStage>("Stage", stageSchema);
export default StageModel;
