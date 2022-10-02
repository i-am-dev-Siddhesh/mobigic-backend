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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutApi = exports.loginApi = exports.me = void 0;
const argon2_1 = __importDefault(require("argon2"));
const auth_1 = require("../../utils/auth");
const constants_1 = require("../../utils/constants");
const errorResponse_1 = require("../../utils/errorResponse");
const prisma_1 = require("../../utils/prisma");
// @desc    GET User
// @route   GET /v1/auth/user/me
// @access  Protected
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user && req.user.password) {
            delete req.user.password;
        }
        return res.status(200).json({ status: true, data: req.user });
    }
    catch (error) {
        let statusCode = 500;
        if (error.status_code) {
            statusCode = error.status_code;
        }
        return res.status(statusCode).json((0, errorResponse_1.generalError)(error));
    }
});
exports.me = me;
// @desc    login user
// @route   GET /v1/auth/user/login
// @access  Public
const loginApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = yield prisma_1.prisma.user.findUnique({
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
        const isValid = yield argon2_1.default.verify(user === null || user === void 0 ? void 0 : user.password, body.password);
        if (!isValid) {
            throw {
                status_code: 400,
                message: "Email/password is invalid",
            };
        }
        let token = (0, auth_1.createJWTToken)(user);
        // @ts-ignore
        req.session.sessionId = token;
        return res.status(200).json({ status: true, data: user });
    }
    catch (error) {
        return res.status((0, errorResponse_1.generalErrorStatusCode)(error)).json((0, errorResponse_1.generalError)(error));
    }
});
exports.loginApi = loginApi;
// @desc    Logout User
// @route   PUT /v1/auth/user/logout
// @access  Protected
const logoutApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((_resolve, _reject) => req.session.destroy((error) => {
        res.clearCookie(constants_1.tokenKey, {
            domain: process.env.COOKIE_DOMAIN,
            path: "/",
        });
        if (error) {
            let statusCode = 500;
            if (statusCode) {
                if (error.status_code) {
                    statusCode = error.status_code;
                }
                return res.status(statusCode).json((0, errorResponse_1.generalError)(error));
            }
        }
        return res.status(200).json({ status: true, message: "cookie cleared" });
    }));
});
exports.logoutApi = logoutApi;
