import express from "express";
import validateJWT from "../middlewares/validateJWT";
import { IExtendRequest } from "../types/extendedRequest";
import { isAdmin } from "../middlewares/validateUserRole";

const router = express.Router();

router.get("/", validateJWT, isAdmin, async (req: IExtendRequest, res) => {
  const userId = req.user._id;
  res.status(201).send("Admin route");
});

export default router;
