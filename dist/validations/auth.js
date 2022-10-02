"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = exports.userRegistrationSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.getUserSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.getUserSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
});
exports.forgotPasswordSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required().messages({
        "string.base": `Email should be a type of string`,
        "string.empty": `Email cannot be an empty field`,
        "any.required": `Email is a required field`,
    }),
});
exports.resetPasswordSchema = joi_1.default.object().keys({
    password: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"))
        .message("Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters"),
    passwordConfirmation: joi_1.default.string()
        .required()
        .valid(joi_1.default.ref("password "))
        .messages({
        "any.only": "Re-Entered password should be same as password",
    }),
});
exports.userRegistrationSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().max(100).messages({
        "string.base": `Name should be a type of string`,
        "string.empty": `Name cannot be an empty field`,
        "any.required": `Name is a required field`,
        "string.max": `Name can have a maximum length of {#limit}`,
    }),
    email: joi_1.default.string().email().required().max(100).messages({
        "string.base": `Email should be a type of string`,
        "string.max": `Email can have a maximum length of {#limit}`,
    }),
    password: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"))
        .message("Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters")
        .messages({
        "string.base": `Password should be a type of string`,
        "any.required": `Password is a required field`,
    }),
    passwordConfirmation: joi_1.default.string()
        .required()
        .valid(joi_1.default.ref("password "))
        .messages({
        "any.only": "Re-Entered password should be same as password",
        "any.required": `Password Coonfirmation is a required field`,
    }),
});
exports.userUpdateSchema = joi_1.default.object().keys({
    name: joi_1.default.string().max(100).messages({
        "string.base": `Name should be a type of string`,
        "string.empty": `Name cannot be an empty field`,
        "string.max": `Name can have a maximum length of {#limit}`,
    }),
    email: joi_1.default.string().email().max(100).messages({
        "string.base": `Email should be a type of string`,
        "string.max": `Email can have a maximum length of {#limit}`,
    }),
    password: joi_1.default.string()
        .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"))
        .message("Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters")
        .messages({
        "string.base": `Password should be a type of string`,
        "any.required": `Password is a required field`,
    }),
    passwordConfirmation: joi_1.default.string()
        .equal(joi_1.default.ref("password "))
        .when("password", {
        is: joi_1.default.any().valid(null, ""),
        then: joi_1.default.optional().allow(null, ""),
        otherwise: joi_1.default.required(),
    })
        .messages({
        "any.only": "Re-Entered password should be same as password",
    }),
});
