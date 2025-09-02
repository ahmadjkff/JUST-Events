import { NextFunction, Response } from "express";
import { IExtendRequest } from "../types/extendedRequest";
import { Roles } from "../types/userTypes";

const isStudent = (req: IExtendRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (req.user.role !== Roles.STUDENT) {
    res.status(401).send("Access denied. Student only.");
    return;
  }

  next();
};

export default isStudent;
