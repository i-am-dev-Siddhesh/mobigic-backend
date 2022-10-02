import { NextFunction, Request, Response } from "express";
import { forbiddenError, generalError } from "../utils/errorResponse";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import { User } from "../utils/types";

export const checkApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = process.env.API_KEY as string;

    if (!req.headers.apikey || req?.headers?.apikey !== apiKey) {
      return res.status(403).json(forbiddenError());
    }

    return next();
  } catch (error: any) {
    return res.status(500).json(generalError(error));
  }
};

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  const token = req.session.sessionId;

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as User;

    const user = await prisma.user.findUnique({
      where: {
        email: decoded?.email!,
      },
    });

    if (!user) {
      throw {
        status_code: 404,
        message: "User not found",
      };
    }
    req.user = user as User;
  } catch (error) {
    return res.status(401).json(forbiddenError());
  }
  next();
};
