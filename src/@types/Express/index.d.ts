import * as express from "express";
import { Category } from "../../entities/categories.entity";
import { IUser } from "../../interfaces/user";

declare global {
  namespace Express {
    interface Request {
      decodedData: any;
      typeValidation: string;
    }
  }
}