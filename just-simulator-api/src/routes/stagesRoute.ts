import express from "express";
import stageModel from "../models/stagesModel";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await stageModel.find();

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Stages fetched successfully",
      data: { events },
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Server error ${error.message}`,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, location, capacity, status, date, startTime, endTime } =
      req.body;
    const newStage = await stageModel.create({
      name,
      location,
      capacity,
      status,
      date,
      startTime,
      endTime,
    });
    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Stage created successfully",
      data: { stage: newStage },
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Server error ${error.message}`,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const stage = await stageModel.findById(id);
    if (!stage) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Stage not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Stage fetched successfully",
      data: { stage },
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Server error ${error.message}`,
    });
  }
});

export default router;
