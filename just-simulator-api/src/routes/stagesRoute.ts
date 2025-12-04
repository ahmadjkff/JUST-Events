import express from "express";

import StageModel, { IStage } from "../models/stagesModel";

const router = express.Router();

const toDateTime = (dateInput: string | Date, time: string) => {
  const base = new Date(dateInput);
  const [hours, minutes] = time.split(":").map(Number);
  base.setHours(hours || 0, minutes || 0, 0, 0);
  return base;
};

const isSameDay = (first: Date, second: Date) =>
  first.toISOString().slice(0, 10) === second.toISOString().slice(0, 10);

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
    console.log(req.body);

    const bookingDate = new Date(date);
    if (Number.isNaN(bookingDate.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking date" });
    }

    const requestedStart = toDateTime(bookingDate, start);
    const requestedEnd = toDateTime(bookingDate, end);

    if (requestedEnd <= requestedStart) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const stage = await StageModel.findById(stageId);
    if (!stage)
      return res
        .status(404)
        .json({ success: false, message: "Stage not found" });

    console.log(stage.bookings);

    const availableSlotIndex =
      stage.freeTimes?.findIndex((slot: any) => {
        const slotStart = toDateTime(slot.date, slot.start);
        const slotEnd = toDateTime(slot.date, slot.end);

        return (
          slotStart <= requestedStart &&
          slotEnd >= requestedEnd &&
          isSameDay(slotStart, requestedStart)
        );
      }) ?? -1;

    if (availableSlotIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Stage is not available during the requested time",
      });
    }

    // Check if already reserved
    const conflict = stage.bookings?.some((booking: any) => {
      const existingStart = toDateTime(booking.date, booking.start);
      const existingEnd = toDateTime(booking.date, booking.end);

      return (
        (requestedStart >= existingStart && requestedStart < existingEnd) ||
        (requestedEnd > existingStart && requestedEnd <= existingEnd)
      );
    });
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Stage already reserved for that time",
      });
    }

    // Add new booking
    stage.bookings?.push({
      date: bookingDate,
      start,
      end,
      eventId,
    });
    if (Array.isArray(stage.freeTimes) && availableSlotIndex > -1) {
      const slot = stage.freeTimes[availableSlotIndex];
      if (!slot)
        return res.status(400).json({
          success: false,
          message: "Slot not found",
        });
      const slotStart = toDateTime(slot.date, slot.start);
      const slotEnd = toDateTime(slot.date, slot.end);

      const updatedSlots = [];

      // Left-side remaining time (before requestedStart)
      if (requestedStart > slotStart) {
        updatedSlots.push({
          date: slot.date,
          start: slot.start,
          end: slot.start < start ? start : slot.start, // using HH:mm format
        });
      }

      // Right-side remaining time (after requestedEnd)
      if (requestedEnd < slotEnd) {
        updatedSlots.push({
          date: slot.date,
          start: end,
          end: slot.end,
        });
      }

      // Replace the old slot with new one(s)
      stage.freeTimes.splice(availableSlotIndex, 1, ...updatedSlots);
    }

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

// Add free times to a stage
router.post("/:id/free-times", async (req, res) => {
  try {
    const { freeTimes } = req.body;

    if (!Array.isArray(freeTimes) || freeTimes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "freeTimes must be a non-empty array",
      });
    }

    const stage = await StageModel.findById(req.params.id);

    if (!stage) {
      return res
        .status(404)
        .json({ success: false, message: "Stage not found" });
    }

    const normalizedSlots = [];
    for (const slot of freeTimes) {
      const { date, start, end } = slot ?? {};

      if (!date || !start || !end) {
        return res.status(400).json({
          success: false,
          message: "Each slot requires date, start, and end",
        });
      }

      const slotDate = new Date(date);
      if (Number.isNaN(slotDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid slot date" });
      }

      const slotStart = toDateTime(slotDate, start);
      const slotEnd = toDateTime(slotDate, end);

      if (slotEnd <= slotStart) {
        return res.status(400).json({
          success: false,
          message: "Slot end must be after slot start",
        });
      }

      normalizedSlots.push({ date: slotDate, start, end });
    }

    stage.freeTimes = [...(stage.freeTimes ?? []), ...normalizedSlots];
    stage.status = stage.bookings?.length ? stage.status : "free";

    await stage.save();

    res.json({
      success: true,
      message: "Free times added successfully",
      data: stage,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message ?? "Unexpected error" });
  }
});

// Delete a free time from a stage
router.delete("/:id/free-times/:slotId", async (req, res) => {
  try {
    const { id, slotId } = req.params;
    const stage = await StageModel.findById(id);

    if (!stage) {
      return res
        .status(404)
        .json({ success: false, message: "Stage not found" });
    }

    const slotIndex =
      stage.freeTimes?.findIndex(
        (slot: any) => slot._id?.toString() === slotId
      ) ?? -1;

    if (slotIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Free time slot not found",
      });
    }

    stage.freeTimes?.splice(slotIndex, 1);

    if (!stage.freeTimes?.length && !stage.bookings?.length) {
      stage.status = "free";
    }

    await stage.save();

    res.json({
      success: true,
      message: "Free time slot deleted successfully",
      data: stage,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message ?? "Unexpected error" });
  }
});

router.delete("/:id/bookings/:bookingId", async (req, res) => {
  try {
    const { id, bookingId } = req.params;
    const stage = await StageModel.findById(id);
    if (!stage) {
      return res
        .status(404)
        .json({ success: false, message: "Stage not found" });
    }
    const bookingIndex =
      stage.bookings?.findIndex(
        (booking: any) => booking._id?.toString() === bookingId
      ) ?? -1;
    if (bookingIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    const [booking] = stage.bookings.splice(bookingIndex, 1);
    // Restore cancelled booking time back into freeTimes
    if (booking) {
      const bookingDate = new Date(booking.date);
      const bookingStart = booking.start;
      const bookingEnd = booking.end;
      // Try to merge with existing free slots on same day, or just push a new one
      const newSlot = {
        date: bookingDate,
        start: bookingStart,
        end: bookingEnd,
      };
      const sameDaySlots = stage.freeTimes?.filter((slot: any) =>
        isSameDay(new Date(slot.date), bookingDate)
      ) as any[];
      if (!sameDaySlots?.length) {
        stage.freeTimes = [...(stage.freeTimes ?? []), newSlot];
      } else {
        stage.freeTimes = [...(stage.freeTimes ?? []), newSlot];
      }
    } // Update status if no more bookings
    if (!stage.bookings?.length) {
      stage.status = stage.freeTimes?.length ? "free" : "free";
    }
    await stage.save();
    return res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: stage,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: error.message ?? "Unexpected error" });
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
