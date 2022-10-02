"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadedFile = exports.uploadFile = exports.resetPasswordApi = exports.forgotPasswordApi = exports.userUpdateApi = exports.userRegistrationApi = void 0;
const argon2_1 = __importDefault(require("argon2"));
const auth_1 = require("../../utils/auth");
const errorResponse_1 = require("../../utils/errorResponse");
const helper_1 = require("../../utils/helper");
const mailgun_1 = require("../../utils/mailgun");
const prisma_1 = require("../../utils/prisma");
// @desc    Add new user register
// @route   POST /v1/user/register
// @access  Public
const userRegistrationApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const isExistingUser = yield prisma_1.prisma.user.findUnique({
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
        const { passwordConfirmation } = body, rest = __rest(body, ["passwordConfirmation"]);
        const hash = yield argon2_1.default.hash(body.password);
        let data = Object.assign(Object.assign({}, rest), { password: hash });
        yield prisma_1.prisma.user.create({
            data,
        });
        return res.status(200).json({
            status: true,
            message: "Registration successfully completed",
        });
    }
    catch (error) {
        let statusCode = 500;
        if (error.status_code) {
            statusCode = error.status_code;
        }
        return res.status(statusCode).json((0, errorResponse_1.generalError)(error));
    }
});
exports.userRegistrationApi = userRegistrationApi;
// @desc    Update User profile
// @route   PUT /v1/user/update
// @access  protected
const userUpdateApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = yield prisma_1.prisma.user.findUnique({
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
            const hash = yield argon2_1.default.hash(body.password);
            delete data.passwordConfirmation;
            data.password = hash;
        }
        yield prisma_1.prisma.user.update({
            where: {
                email: user === null || user === void 0 ? void 0 : user.email,
            },
            data,
        });
        return res.status(200).json({
            status: true,
            message: `User updated successfully`,
        });
    }
    catch (error) {
        let statusCode = 500;
        if (error.statusCode) {
            statusCode = error.statusCode;
        }
        return res.status(statusCode).json((0, errorResponse_1.generalError)(error));
    }
});
exports.userUpdateApi = userUpdateApi;
// @desc    forgot password of Customer
// @route   POST /v1/user/forgotPassword
// @access  Public
const forgotPasswordApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = yield prisma_1.prisma.user.findUnique({
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
        let token = (0, auth_1.createJWTToken)({
            email: user.email,
        });
        const redisObj = req.redis;
        // This is helper function for set values in redis store
        (0, helper_1.setValueInRedisWithExp)(redisObj, token, 300, token);
        const messageData = {
            from: `Excited User <${process.env.MAILGUN_SENDER_EMAIL}>`,
            to: user.email,
            subject: "Mobigic Verification Code",
            html: `<h1>
      Following link will reset your password
      </h1>
      
      <a href="${process.env.CLIENT_URL}/reset-password?token=${token}">Click Here
      </a>`,
        };
        yield (0, mailgun_1.sendMailGunEmail)(messageData);
        return res.status(200).json({
            status: true,
            data: {
                message: "Verification code sent to your email.",
            },
        });
    }
    catch (error) {
        let statusCode = 500;
        if (error.status_code) {
            statusCode = error.status_code;
        }
        return res.status(statusCode).json((0, errorResponse_1.generalError)(error));
    }
});
exports.forgotPasswordApi = forgotPasswordApi;
// @desc    reset password
// @route   PUT /v1/user/resetPassword
// @access  protected
const resetPasswordApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const token = req.query.token;
        const redisObj = req.redis;
        const redisToken = yield (0, helper_1.getValueInRedis)(redisObj, token);
        if (redisToken !== `"${token}"`) {
            throw {
                statusCode: 404,
                message: "Link expired",
            };
        }
        let decoded = (0, auth_1.decodeJWTToken)(token);
        const email = decoded === null || decoded === void 0 ? void 0 : decoded.email;
        const user = yield prisma_1.prisma.user.findUnique({
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
        const hash = yield argon2_1.default.hash(body.password);
        yield prisma_1.prisma.user.update({
            where: {
                email: user === null || user === void 0 ? void 0 : user.email,
            },
            data: {
                password: hash,
            },
        });
        return res.status(200).json({
            status: true,
            message: `Password changed successfully`,
        });
    }
    catch (error) {
        let statusCode = 500;
        if (error.statusCode) {
            statusCode = error.statusCode;
        }
        return res.status(statusCode).json((0, errorResponse_1.generalError)(error));
    }
});
exports.resetPasswordApi = resetPasswordApi;
// @desc    Upload File
// @route   POST /v1/user/file
// @access  protected
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            throw {
                message: "File not found",
            };
        }
        const filePath = req.file.filename;
        const code = Math.floor(100000 + Math.random() * 900000);
        const user = req.user;
        yield prisma_1.prisma.files.create({
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
    }
    catch (error) {
        let statusCode = 500;
        if (error.statusCode) {
            statusCode = error.statusCode;
        }
        return res.status(statusCode).json((0, errorResponse_1.generalError)(error));
    }
});
exports.uploadFile = uploadFile;
// @desc    Download File
// @route   POST /v1/user/file/download
// @access  protected
const getUploadedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = req.body.filename;
        const code = req.body.code;
        const file = yield prisma_1.prisma.files.findFirst({
            where: {
                fileUrl: fileName,
                ownerId: req.user.id,
                code: code,
            },
        });
        if (!file) {
            throw {
                message: "Invalid code or file.",
                statusCode: 404,
            };
        }
        return res.sendFile(fileName, { root: "public" });
    }
    catch (error) {
        let statusCode = 500;
        if (error.statusCode) {
            statusCode = error.statusCode;
        }
        return res.status(statusCode).json((0, errorResponse_1.generalError)(error));
    }
});
exports.getUploadedFile = getUploadedFile;
