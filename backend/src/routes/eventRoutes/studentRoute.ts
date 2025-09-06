import express, { Request, Response } from "express";
import { studentService } from "../../services/eventServices/studentService";


const router = express.Router();

/**
 * Register for an event
 */

router.post("/register/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    if (!eventId || !studentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId or studentId",
      });
    }

    const registration = await studentService.register(eventId, studentId);


    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Registered successfully",
      data: registration,
    });
  } catch (error: any) {
    res.status(400).json({ statusCode: 400, success: false, message: error.message });
  }
});

/**
 * Cancel event registration
 */
router.delete("/cancel/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    if (!eventId || !studentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId or studentId",
      });
    }

    await studentService.cancel(eventId, studentId);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error: any) {
    res.status(400).json({ statusCode: 400, success: false, message: error.message });
  }
});

/**
 * Volunteer for event
 */
router.post("/volunteer/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    if (!eventId || !studentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId or studentId",
      });
    }

    const updated = await studentService.volunteer(eventId, studentId);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Volunteer added successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ statusCode: 400, success: false, message: error.message });
  }
});

/**
 * Provide feedback
 */
router.post("/feedback/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId, rating, comment } = req.body;
    const { eventId } = req.params;

    if (!eventId || !studentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId or studentId",
      });
    }

    const feedback = await studentService.feedback(eventId, studentId, rating, comment);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error: any) {
    res.status(400).json({ statusCode: 400, success: false, message: error.message });
  }
});

/**
 * Download certificate
 */
router.get("/certificate/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    if (!eventId || !studentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId or studentId",
      });
    }

    const certificate = await studentService.certificate(eventId, studentId);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Certificate retrieved successfully",
      data: certificate,
    });
  } catch (error: any) {
    res.status(400).json({ statusCode: 400, success: false, message: error.message });
  }
});

export default router;
