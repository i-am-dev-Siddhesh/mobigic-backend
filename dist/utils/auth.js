"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWTToken = exports.createJWTToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
const createJWTToken = (data) => {
    const token = jsonwebtoken_1.default.sign(data, process.env.JWT_TOKEN_SECRET, {
        expiresIn: constants_1.tokenExp,
    });
    return token;
};
exports.createJWTToken = createJWTToken;
const decodeJWTToken = (data) => {
    const token = jsonwebtoken_1.default.decode(data);
    return token;
};
exports.decodeJWTToken = decodeJWTToken;
