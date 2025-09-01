import { NextFunction, Response } from "express";
import { IExtendRequest } from "../types/extendedRequest";

const isStudent = (req: IExtendRequest, res: Response, next: NextFunction) => {
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
