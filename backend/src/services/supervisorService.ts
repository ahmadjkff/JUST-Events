import { eventModel } from "../models/eventModel";

interface IBody {
  title: string;
  description: string;
  location: string;
  date: Date;
  supervisorId: string;
}

export const createEvent = async ({
  title,
  description,
  location,
  date,
  supervisorId,
}: IBody) => {
  const event = new eventModel({
    title,
    description,
    location,
    date,
    createdBy: supervisorId,
    status: "pending",
  });

  await event.save();

  return { data: { event }, statusCode: 201 };
};
