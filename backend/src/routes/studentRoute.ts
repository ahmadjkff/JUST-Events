import express from "express";
import validateJWT from "../middlewares/validateJWT";
import { ExtendRequest } from "../types/ExtendRequest";
import isStudent from "../middlewares/isStudent";

const router = express.Router();

router.get("/", validateJWT, isStudent, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  res.status(201).send("Student Route");
});
export default router;
