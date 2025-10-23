import express from "express";

import StageModel, { IStage } from "../models/stagesModel";

const router = express.Router();

// get All Stages
router.get("/", async (req, res) => {
  try {
    const stages = await StageModel.find();
    res.json({ success: true, data: stages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new stage
router.post("/", async (req, res) => {
  try {
    const stage = new StageModel(req.body);
    await stage.save();
    res.status(201).json({ success: true, data: stage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a stage by ID
router.get("/:id", async (req, res) => {
  try {
    const stage = await StageModel.findById(req.params.id);
    if (!stage)
      return res
        .status(404)
        .json({ success: false, message: "Stage not found" });
    res.json({ success: true, data: stage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// check stage availability
router.post("/:id/availability", async (req, res) => {
  try {
    const { stageId, date, start, end } = req.body;
    const stage = (await StageModel.findById(stageId)) as IStage | null;

    if (!stage)
      return res
        .status(404)
        .json({ success: false, message: "Stage not found" });

    // Check date match
    const conflict = stage.bookings?.some(
      (b) =>
        b.date === date &&
        ((start >= b.start && start < b.end) || (end > b.start && end <= b.end))
    );

    console.log("Conflict:", conflict);

    const availableInFreeTimes = stage.freeTimes?.some(
      (ft) =>
        new Date(ft.date).toISOString().split("T")[0] === date &&
        start >= ft.start &&
        end <= ft.end
    );

    console.log("Available in free times:", availableInFreeTimes);

    if (!availableInFreeTimes || conflict) {
      return res.json({
        success: false,
        message: "Stage is not available at this time",
      });
    }

    res.json({ success: true, message: "Stage is available" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Book a stage
router.post("/:id/book", async (req, res) => {
  try {
    const { stageId, date, start, end, eventId } = req.body;
    const stage = await StageModel.findById(stageId);
    if (!stage)
      return res
        .status(404)
        .json({ success: false, message: "Stage not found" });

    // Check if already reserved
    const conflict = stage.bookings?.some(
      (booking: any) =>
        (start >= booking.start && start < booking.end) ||
        (end > booking.start && end <= booking.end)
    );
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Stage already reserved for that time",
      });
    }

    // Add new booking
    stage.bookings?.push({ date, start, end, eventId });
    stage.status = "reserved";
    await stage.save();

    res.json({
      success: true,
      message: "Stage reserved successfully",
      data: stage,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a stage by ID
router.put("/:id", async (req, res) => {
  try {
    const stage = await StageModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!stage)
      return res
        .status(404)
        .json({ success: false, message: "Stage not found" });
    res.json({ success: true, data: stage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a stage by ID
router.delete("/:id", async (req, res) => {
  try {
    const stage = await StageModel.findByIdAndDelete(req.params.id);
    if (!stage)
      return res
        .status(404)
        .json({ success: false, message: "Stage not found" });
    res.json({ success: true, message: "Stage deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
