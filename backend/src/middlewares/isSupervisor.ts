import { NextFunction, Response } from "express";
import { IExtendRequest } from "../types/extendedRequest";
import { Roles } from "../types/userTypes";

const isSupervisor = (
  req: IExtendRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (req.user.role !== Roles.SUPERVISOR) {
    res.status(401).send("Access denied. supervisor only.");
    return;
  }

  next();
};

export default isSupervisor;
