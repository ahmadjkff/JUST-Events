import eventModel from "../../models/eventModel";
import RegistrationModel, { IRegistration } from "../../models/registrationModel";
import { FeedbackModel, IFeedback } from "../../models/feedbackModel";
import { certificateModel, ICertificate } from "../../models/certificateModel";

export const studentService = {
  async register(eventId: string, studentId: string): Promise<IRegistration> {
    const event = await eventModel.findById(eventId);
    if (!event) throw new Error("Event not found");

    const existing = await RegistrationModel.findOne({ student: studentId, event: eventId });
    if (existing) throw new Error("Already registered for this event");

    return await RegistrationModel.create({
      student: studentId,
      event: eventId,
      isVolunteer: false,
    });
  },

  async cancel(eventId: string, studentId: string): Promise<IRegistration> {
    const deleted = await RegistrationModel.findOneAndDelete({ student: studentId, event: eventId });
    if (!deleted) throw new Error("Registration not found");
    return deleted;
  },

  async volunteer(eventId: string, studentId: string): Promise<IRegistration> {
    return await RegistrationModel.findOneAndUpdate(
      { student: studentId, event: eventId },
      { isVolunteer: true },
      { new: true, upsert: true }
    );
  },

  async feedback(
    eventId: string,
    studentId: string,
    rating: number,
    comment: string
  ): Promise<IFeedback> {
    return await FeedbackModel.create({ student: studentId, event: eventId, rating, comment });
  },

  async certificate(eventId: string, studentId: string): Promise<ICertificate> {
    const certificate = await certificateModel.findOne({ student: studentId, event: eventId });
    if (!certificate) throw new Error("Certificate not found");
    return certificate;
  },
};
