import express from "express";
import validateJWT from "../../middlewares/validateJWT";
import { IExtendRequest } from "../../types/extendedRequest";
import { isAdmin } from "../../middlewares/validateUserRole";
import { editRole } from "../../services/authServices/adminService";
import { Roles } from "../../types/userTypes";
import userModel from "../../models/userModel";

const router = express.Router();

router.get("/", async (req, res) => {
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

router.put(
  "/edit-role/:userId",
  validateJWT,
  isAdmin,
  async (req: IExtendRequest, res) => {
    try {
      const { newRole } = req.body;
      if (!newRole || !Object.values(Roles).includes(newRole as Roles)) {
        return res.status(400).json({ message: "Invalid role specified" });
      }

      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const { statusCode, data, message, success } = await editRole(
        userId,
        newRole
      );

      res.status(statusCode).json({ success, message, data });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

export default router;
