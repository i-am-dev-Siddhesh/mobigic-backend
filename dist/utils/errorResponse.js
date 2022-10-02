"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbiddenError = exports.generalErrorStatusCode = exports.generalError = exports.HttpException = void 0;
const constants_1 = require("./constants");
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.HttpException = HttpException;
const generalError = (error) => {
    const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || constants_1.GENERAL_ERROR_MESSAGE;
    return {
        status: false,
        message: errorMessage,
    };
};
exports.generalError = generalError;
const generalErrorStatusCode = (error) => {
    const code = (error === null || error === void 0 ? void 0 : error.status_code) || 500;
    return code;
};
exports.generalErrorStatusCode = generalErrorStatusCode;
const forbiddenError = () => ({
    status: false,
    message: constants_1.ACCESS_DENIED_MESSAGE,
});
exports.forbiddenError = forbiddenError;
