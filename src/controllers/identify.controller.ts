import { Request, Response } from "express";
import { reconcileIdentity } from "../services/identity.service";

export const identify = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  const result = await reconcileIdentity(email, phoneNumber);

  res.status(200).json(result);
};