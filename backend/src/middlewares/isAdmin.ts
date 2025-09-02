import { NextFunction, Response } from "express";
import { IExtendRequest } from "../types/extendedRequest";
import { Roles } from "../types/userTypes";

const isAdmin = (req: IExtendRequest, res: Response, next: NextFunction) => {
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

export default isAdmin;
