import { NextFunction, Response } from "express";
import { ExtendRequest } from "../types/ExtendRequest";

const isStudent = (req: ExtendRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (req.user.role !== "student") {
    res.status(401).send("Access denied. Student only.");
    return;
  }

  next();
};

export default isStudent;
