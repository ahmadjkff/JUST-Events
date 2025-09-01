import express from "express";
import validateJWT from "../middlewares/validateJWT";
import { ExtendRequest } from "../types/ExtendRequest";
import isAdmin from "../middlewares/isAdmin";

const router = express.Router();

router.get("/", validateJWT, isAdmin, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  res.status(201).send("Admin route");
});
export default router;
