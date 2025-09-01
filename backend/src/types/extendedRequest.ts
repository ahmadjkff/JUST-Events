import { Request } from "express";

export interface IExtendRequest extends Request {
  user?: any;
}
