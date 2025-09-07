import express, { Request, Response } from "express";
import RegistrationModel from "../../models/registrationModel";
import { EventStatus } from "../../types/eventTypes";
import eventModel from "../../models/eventModel";

const router = express.Router();

router.get("/:eventId/students", async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const { status } = req.query;

  try {
    if (!eventId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId",
      });
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Event not found",
      });
    }

    let filter: any = { event: eventId };

    if (status) {
      // validate only if status was provided
      console.log(status);

      if (
        !(Object.values(EventStatus) as string[]).includes(status as string)
      ) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: "Invalid status value",
        });
      }
      filter.status = status; // use status directly
    }

    const students: any = await RegistrationModel.find(filter);

    return res.json({
      statusCode: 200,
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error: any) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Error fetching students: ${error.message}`,
    });
  }
});

export default router;
