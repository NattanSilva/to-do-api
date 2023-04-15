import { Request, Response } from "express";
import { createSessionService } from "../services/user/createSession.service";

export const createSessionController = async (req: Request, res: Response) => {
  const token = await createSessionService(req.body)
  return res.status(200).json(token)
}