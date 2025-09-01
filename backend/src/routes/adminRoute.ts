import bcrypt from "bcrypt";
import express from "express";
import validateJWT from "../middlewares/validateJWT";
import isAdmin from "../middlewares/isAdmin";
import { IExtendRequest } from "../types/extendedRequest";
import { Roles } from "../types/userTypes";
import { createAdmin } from "../services/userService";

const router = express.Router();

router.get("/", validateJWT, isAdmin, async (req: IExtendRequest, res) => {
  const userId = req.user._id;
  res.status(201).send("Admin route");
});

interface createAdminRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

router.post(
  "/create-admin",
  validateJWT,
  isAdmin,
  async (req: IExtendRequest, res) => {
    try {
      const curUser = req.user;

      if (!curUser || curUser.role !== Roles.ADMIN) {
        return res.status(403).json("Access denied. Admins only.");
      }

      const { firstName, lastName, email, password } =
        req.body as createAdminRequestBody;

      const hashedPassword = await bcrypt.hash(password, 10);
      const { statusCode, data } = await createAdmin({
        firstName,
        lastName,
        email,
        role: Roles.ADMIN,
        password: hashedPassword,
      });

      res.status(statusCode).json(data);
    } catch (err) {
      res.status(500).json("Server error");
    }
  }
);
export default router;
