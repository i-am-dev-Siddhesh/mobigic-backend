import { Request, Response } from "express";
import { SERVER_RUNNING_MESSAGE } from "../utils/constants";
import { generalError } from "../utils/errorResponse";

// @desc    Check Server Health
// @route   GET /v1/
// @access  Public
export const checkServerHealth = (_req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .json({ status: true, message: SERVER_RUNNING_MESSAGE });
  } catch (error: any) {
    return res.status(500).json(generalError(error));
  }
};
