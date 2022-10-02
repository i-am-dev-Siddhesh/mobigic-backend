import argon2 from "argon2";
import { Request, Response } from "express";
import { createJWTToken } from "../../utils/auth";
import { tokenKey } from "../../utils/constants";
import {
  generalError,
  generalErrorStatusCode
} from "../../utils/errorResponse";
import { prisma } from "../../utils/prisma";

// @desc    GET User
// @route   GET /v1/auth/user/me
// @access  Protected
export const me = async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.password) {
      delete req.user.password;
    }
    return res.status(200).json({ status: true, data: req.user });
  } catch (error: any) {
    let statusCode = 500;
    if (error.status_code) {
      statusCode = error.status_code;
    }
    return res.status(statusCode).json(generalError(error));
  }
};

// @desc    login user
// @route   GET /v1/auth/user/login
// @access  Public
export const loginApi = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw {
        status_code: 404,
        message: "User not found",
      };
    }
    const isValid = await argon2.verify(user?.password, body.password);

    if (!isValid) {
      throw {
        status_code: 400,
        message: "Email/password is invalid",
      };
    }
    let token = createJWTToken(user);
    // @ts-ignore
    req.session.sessionId = token;
    return res.status(200).json({ status: true, data: user });
  } catch (error: any) {
    return res.status(generalErrorStatusCode(error)).json(generalError(error));
  }
};

// @desc    Logout User
// @route   PUT /v1/auth/user/logout
// @access  Protected
export const logoutApi = async (req: Request, res: Response) => {
  return new Promise((_resolve, _reject) =>
    req.session.destroy((error: any) => {
      res.clearCookie(tokenKey, {
        domain: process.env.COOKIE_DOMAIN,
        path: "/",
      });
      if (error) {
        let statusCode = 500;
        if (statusCode) {
          if (error.status_code) {
            statusCode = error.status_code;
          }
          return res.status(statusCode).json(generalError(error));
        }
      }
      return res.status(200).json({ status: true, message: "cookie cleared" });
    })
  );
};