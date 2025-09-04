import express from "express";
import validateJWT from "../../middlewares/validateJWT";
import { isStudent } from "../../middlewares/validateUserRole";
import { IExtendRequest } from "../../types/extendedRequest";

const router = express.Router();

router.get("/", validateJWT, isStudent, async (req: IExtendRequest, res) => {
  const userId = req.user._id;
  res.status(201).send("Student Route");
});
export default router;
