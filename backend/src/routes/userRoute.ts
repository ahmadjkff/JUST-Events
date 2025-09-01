import bcrypt from "bcrypt";
import express from "express";
import { createAdmin, login, register } from "../services/userService";
import { Roles } from "../types/userTypes";
import { IExtendRequest } from "../types/extendedRequest";
import { validateJWT } from "../middlewares/validateJWT";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { statusCode, data } = await register({
      firstName,
      lastName,
      email,
      password,
    });
    return res.status(statusCode).send(data);
  } catch {
    return res.status(404).send("Somethin went Wrong");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { statusCode, data } = await login({ email, password });
    return res.status(statusCode).send(data);
  } catch {
    return res.status(404).send("Somethin went Wrong");
  }
});

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

export default router;
