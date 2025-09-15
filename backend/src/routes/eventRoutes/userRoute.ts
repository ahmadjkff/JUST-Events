import express from "express";
import validateJWT from "../../middlewares/validateJWT";
import { getEventsByStatus } from "../../services/eventServices/userService";
import AppError from "../../types/AppError";

const router = express.Router();

router.get("/", validateJWT, async (req, res) => {
  try {
    const { status } = req.query;

    const events = await getEventsByStatus(status as string | undefined);

    return res.status(200).json({
      message: status
        ? `${status} events fetched successfully`
        : "All events fetched successfully",
      success: true,
      data: events,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: `Server error ${error.message}`,
    });
  }
});

export default router;
