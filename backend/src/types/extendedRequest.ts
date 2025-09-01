import { Request } from "express";
import { Roles } from "./userTypes";

export interface IExtendRequest extends Request {
  user?: any;
}
