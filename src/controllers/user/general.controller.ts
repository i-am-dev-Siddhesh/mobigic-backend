import argon2 from "argon2";
import { Request, Response } from "express";
import fs from "fs";
import mime from "mime";
import { createJWTToken, decodeJWTToken } from "../../utils/auth";
import { generalError } from "../../utils/errorResponse";
import { getValueInRedis, setValueInRedisWithExp } from "../../utils/helper";
import { sendMailGunEmail } from "../../utils/mailgun";
import { prisma } from "../../utils/prisma";

// @desc    Add new user register
// @route   POST /v1/user/register
// @access  Public
export const userRegistrationApi = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const isExistingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (isExistingUser) {
      throw {
        statusCode: 400,
        message: "User already exists",
      };
    }

    const { passwordConfirmation, ...rest } = body;

    const hash = await argon2.hash(body.password);

    let data = {
      ...rest,
      password: hash,
    };

    await prisma.user.create({
      data,
    });

    return res.status(200).json({
      status: true,
      message: "Registration successfully completed",
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.status_code) {
      statusCode = error.status_code;
    }
    return res.status(statusCode).json(generalError(error));
  }
};

// @desc    Update User profile
// @route   PUT /v1/user/update
// @access  protected
export const userUpdateApi = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw {
        statusCode: 404,
        message: "User Doesn't Exists",
      };
    }

    let data = body;

    if (body.password) {
      const hash = await argon2.hash(body.password);
      delete data.passwordConfirmation;
      data.password = hash;
    }
    await prisma.user.update({
      where: {
        email: user?.email,
      },
      data,
    });

    return res.status(200).json({
      status: true,
      message: `User updated successfully`,
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.statusCode) {
      statusCode = error.statusCode;
    }
    return res.status(statusCode).json(generalError(error));
  }
};

// @desc    forgot password of Customer
// @route   POST /v1/user/forgotPassword
// @access  Public
export const forgotPasswordApi = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw {
        statusCode: 404,
        message: "User Doesn't Exists",
      };
    }

    let token = createJWTToken({
      email: user.email,
    });

    const redisObj = req.redis;
    // This is helper function for set values in redis store
    setValueInRedisWithExp(redisObj, token, 300, token);

    const messageData: any = {
      from: `Excited User <${process.env.MAILGUN_SENDER_EMAIL}>`,
      to: user.email,
      subject: "Mobigic Verification Code",
      html: `<h1>
      Following link will reset your password
      </h1>
      
      <a href="${process.env.CLIENT_URL}/reset-password?token=${token}">Click Here
      </a>`,
    };

    await sendMailGunEmail(messageData);

    return res.status(200).json({
      status: true,
      data: {
        message: "Verification code sent to your email.",
      },
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.status_code) {
      statusCode = error.status_code;
    }
    return res.status(statusCode).json(generalError(error));
  }
};

// @desc    reset password
// @route   PUT /v1/user/resetPassword
// @access  protected
export const resetPasswordApi = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const token = req.query.token;

    const redisObj = req.redis;
    const redisToken: any = await getValueInRedis(redisObj, token);

    if (redisToken !== `"${token}"`) {
      throw {
        statusCode: 404,
        message: "Link expired",
      };
    }

    let decoded: any = decodeJWTToken(token);
    const email = decoded?.email;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw {
        statusCode: 404,
        message: "User Doesn't Exists",
      };
    }

    const hash = await argon2.hash(body.password);

    await prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        password: hash,
      },
    });

    return res.status(200).json({
      status: true,
      message: `Password changed successfully`,
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.statusCode) {
      statusCode = error.statusCode;
    }
    return res.status(statusCode).json(generalError(error));
  }
};

// @desc    Upload File
// @route   POST /v1/user/file
// @access  protected
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw {
        message: "File not found",
      };
    }
    const filePath = req.file.filename;
    const code = Math.floor(100000 + Math.random() * 900000);
    const user = req.user;

    await prisma.files.create({
      data: {
        fileUrl: filePath,
        code: code,
        ownerId: user.id,
      },
    });

    return res.status(200).json({
      status: true,
      message: `File uploaded successfully`,
      file: filePath,
      code: code,
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.statusCode) {
      statusCode = error.statusCode;
    }
    return res.status(statusCode).json(generalError(error));
  }
};

// @desc    Download File
// @route   POST /v1/user/file/download
// @access  protected
export const getUploadedFile = async (req: Request, res: Response) => {
  try {
    const fileName = req.body.filename;
    const code = req.body.code;
    const data = {
      fileUrl: fileName,
      ownerId: req?.user?.id,
      code: code,
    };

    const file = await prisma.files.findFirst({
      where: data,
    });

    if (!file) {
      throw {
        message: "Invalid code or file.",
        statusCode: 404,
      };
    }

    const filePath = "public/" + fileName;
    const stream = fs.createReadStream(filePath);
    // @ts-ignore
    const type = mime.getType("public/" + fileName);
    res.setHeader("Content-Type", type);
    res.setHeader("Content-Disposition", `inline; filename=${fileName}`);

    return stream.pipe(res);
  } catch (error: any) {
    let statusCode = 500;
    if (error.statusCode) {
      statusCode = error.statusCode;
    }
    return res.status(statusCode).json(generalError(error));
  }
};

// @desc    GET Files
// @route   GET /v1/user/file
// @access  protected
export const getFile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const files = await prisma.files.findMany({
      where: {
        ownerId: user.id,
      },
      select: {
        fileUrl: true,
        id: true,
      },
    });

    return res.status(200).json({
      status: true,
      data: files,
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.statusCode) {
      statusCode = error.statusCode;
    }
    return res.status(statusCode).json(generalError(error));
  }
};
