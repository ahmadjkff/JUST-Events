import bcrypt from "bcrypt";
import express from "express";
import { createAdmin } from "../services/userService";
import { Roles } from "../types/userTypes";
import { IExtendRequest } from "../types/extendedRequest";
import { validateJWT } from "../middlewares/validateJWT";

const router = express.Router();

interface createAdminRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

router.post("/create-admin", validateJWT, async (req: IExtendRequest, res) => {
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
    res.status(500).json({ message: "Server error", error: err });
  }
});
