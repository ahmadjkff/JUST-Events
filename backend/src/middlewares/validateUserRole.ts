import { NextFunction, Response } from "express";
import { IExtendRequest } from "../types/extendedRequest";
import { Roles } from "../types/userTypes";

export const isAdmin = (
  req: IExtendRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (req.user.role !== Roles.ADMIN) {
    res.status(401).send("Access denied. Admins only.");
    return;
  }

  next();
};

export const isSupervisor = (
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

export const isStudent = (
  req: IExtendRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (req.user.role !== Roles.SUPERVISOR) {
    res.status(401).send("Access denied. Student only.");
    return;
  }

  next();
};
