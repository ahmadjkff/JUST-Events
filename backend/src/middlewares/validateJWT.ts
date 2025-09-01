import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import userModel from "../models/userModel";
import { IExtendRequest } from "../types/extendedRequest";

export const validateJWT = async (
  req: IExtendRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.get("authorization");

  if (!authorizationHeader) {
    res.status(403).send("Authorization header was not provided");
    return;
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    res.status(403).send("Bearer token not found");
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET!, async (err, payload) => {
    if (err) {
      res.status(403).send("Invalid token");
      return;
    }
    if (!payload) {
      res.status(403).send("Invalid token payload");
      return;
    }

    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    const user = await userModel.findOne({ email: userPayload.email });
    if (!user) {
      res.status(403).send("User not found");
      return;
    }
    req.user = user;
    next();
  });
};

export default validateJWT;
