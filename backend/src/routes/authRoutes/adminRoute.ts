import express from "express";
import validateJWT from "../../middlewares/validateJWT";
import { IExtendRequest } from "../../types/extendedRequest";
import { isAdmin } from "../../middlewares/validateUserRole";
import { editRole } from "../../services/adminService";
import { Roles } from "../../types/userTypes";

const router = express.Router();

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

      const { statusCode, data } = await editRole(userId, newRole);

      res
        .status(statusCode)
        .json({ data: { message: data.message, user: data.user } });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

export default router;
