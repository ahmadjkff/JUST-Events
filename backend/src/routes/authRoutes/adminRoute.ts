import express from "express";
import validateJWT from "../../middlewares/validateJWT";
import { isAdmin } from "../../middlewares/validateUserRole";
import userModel from "../../models/userModel";

const router = express.Router();

router.get("/", validateJWT, isAdmin, async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({
      success: true,
      message: "users returned successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/:id", validateJWT, isAdmin, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user || !user.email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const response = await fetch(
      `${process.env.SIMULATOR_API}/admin/${user.email}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      return res
        .status(response.status)
        .json({ success: false, message: errorData.message });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
