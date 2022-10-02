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
exports.checkToken = exports.checkApiKey = void 0;
const errorResponse_1 = require("../utils/errorResponse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const checkApiKey = (req, res, next) => {
    var _a;
    try {
        const apiKey = process.env.API_KEY;
        if (!req.headers.apikey || ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.apikey) !== apiKey) {
            return res.status(403).json((0, errorResponse_1.forbiddenError)());
        }
        return next();
    }
    catch (error) {
        return res.status(500).json((0, errorResponse_1.generalError)(error));
    }
};
exports.checkApiKey = checkApiKey;
const checkToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const token = req.session.sessionId;
    try {
        console.log("token", token);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET);
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
            },
        });
        if (!user) {
            throw {
                status_code: 404,
                message: "User not found",
            };
        }
        req.user = user;
    }
    catch (error) {
        return res.status(401).json((0, errorResponse_1.forbiddenError)());
    }
    next();
});
exports.checkToken = checkToken;
