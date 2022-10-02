"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signedUrlExp = exports.tokenExp = exports.tokenKey = exports.SERVER_RUNNING_MESSAGE = exports.GENERAL_ERROR_MESSAGE = exports.ACCESS_DENIED_MESSAGE = exports.__prod__ = void 0;
exports.__prod__ = process.env.SERVER_ENV === "production";
exports.ACCESS_DENIED_MESSAGE = "Access to the resource is denied", exports.GENERAL_ERROR_MESSAGE = "Something went wrong", exports.SERVER_RUNNING_MESSAGE = "Server is in running state";
exports.tokenKey = 'qid', exports.tokenExp = 1000 * 60 * 60 * 24 * 365 * 10; // 10 years
exports.signedUrlExp = 600; // seconds
