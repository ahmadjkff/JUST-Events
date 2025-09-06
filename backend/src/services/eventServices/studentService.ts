import eventModel from "../../models/eventModel";
import RegistrationModel, {
  IRegistration,
} from "../../models/registrationModel";
//import { FeedbackModel, IFeedback } from "../../models/feedbackModel";
import { certificateModel, ICertificate } from "../../models/certificateModel";
import PDFDocument from "pdfkit";
import { Response } from "express";

export const studentService = {
  async register(eventId: string, studentId: string): Promise<IRegistration> {
    const event = await eventModel.findById(eventId);
    if (!event) throw new Error("Event not found");

    const existing = await RegistrationModel.findOne({
      student: studentId,
      event: eventId,
    });
    if (existing) throw new Error("Already registered for this event");

    return await RegistrationModel.create({
      student: studentId,
      event: eventId,
      isVolunteer: false,
    });
  },

  async cancel(eventId: string, studentId: string): Promise<IRegistration> {
    const deleted = await RegistrationModel.findOneAndDelete({
      student: studentId,
      event: eventId,
    });
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

  // async feedback(
  //   eventId: string,
  //   studentId: string,
  //   rating: number,
  //   comment: string
  // ): Promise<IFeedback> {
  //   return await FeedbackModel.create({
  //     student: studentId,
  //     event: eventId,
  //     rating,
  //     comment,
  //   });
  // },

  async certificate(eventId: string, studentId: string): Promise<ICertificate> {
    const certificate = await certificateModel.findOne({
      student: studentId,
      event: eventId,
    });
    if (!certificate) throw new Error("Certificate not found");
    return certificate;
  },
};

export const generateCertificate = async (
  res: Response,
  studentName: string,
  eventTitle: string,
  date: Date
) => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });

  // Set response headers so browser downloads file
  res.setHeader("Content-Disposition", `attachment; filename=certificate.pdf`);
  res.setHeader("Content-Type", "application/pdf");

  // Pipe PDF directly to response
  doc.pipe(res);

  // Background (optional - use .image if you have template)
  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fdfdfd");

  // Title
  doc
    .fontSize(28)
    .fillColor("#333")
    .text("Certificate of Participation", { align: "center" });

  doc.moveDown();

  // Content
  doc
    .fontSize(18)
    .text(`This certificate is proudly presented to`, { align: "center" });

  doc.moveDown();

  doc.fontSize(24).fillColor("#2E86C1").text(studentName, { align: "center" });

  doc.moveDown();

  doc
    .fontSize(16)
    .fillColor("#333")
    .text(
      `For participating in the event "${eventTitle}" held on ${date.toDateString()}.`,
      { align: "center" }
    );

  // Signatures (optional)
  doc.moveDown().moveDown();
  doc.text("__________________", 150, 400);
  doc.text("Event Organizer", 150, 420);

  doc.text("__________________", 500, 400);
  doc.text("University Seal", 500, 420);

  doc.end();
};
