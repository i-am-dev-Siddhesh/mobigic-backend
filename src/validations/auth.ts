import Joi from "joi";

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const getUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
});

export const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    "string.base": `Email should be a type of string`,
    "string.empty": `Email cannot be an empty field`,
    "any.required": `Email is a required field`,
  }),
});

export const resetPasswordSchema = Joi.object().keys({
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .message(
      "Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters"
    ),
  passwordConfirmation: Joi.string()
    .required()
    .valid(Joi.ref("password "))
    .messages({
      "any.only": "Re-Entered password should be same as password",
    }),
});

export const userRegistrationSchema = Joi.object().keys({
  name: Joi.string().required().max(100).messages({
    "string.base": `Name should be a type of string`,
    "string.empty": `Name cannot be an empty field`,
    "any.required": `Name is a required field`,
    "string.max": `Name can have a maximum length of {#limit}`,
  }),

  email: Joi.string().email().required().max(100).messages({
    "string.base": `Email should be a type of string`,
    "string.max": `Email can have a maximum length of {#limit}`,
  }),

  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .message(
      "Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters"
    )
    .messages({
      "string.base": `Password should be a type of string`,
      "any.required": `Password is a required field`,
    }),
  passwordConfirmation: Joi.string()
    .required()
    .valid(Joi.ref("password "))
    .messages({
      "any.only": "Re-Entered password should be same as password",
      "any.required": `Password Coonfirmation is a required field`,
    }),
});

export const userUpdateSchema = Joi.object().keys({
  name: Joi.string().max(100).messages({
    "string.base": `Name should be a type of string`,
    "string.empty": `Name cannot be an empty field`,
    "string.max": `Name can have a maximum length of {#limit}`,
  }),

  email: Joi.string().email().max(100).messages({
    "string.base": `Email should be a type of string`,
    "string.max": `Email can have a maximum length of {#limit}`,
  }),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .message(
      "Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters"
    )
    .messages({
      "string.base": `Password should be a type of string`,
      "any.required": `Password is a required field`,
    }),

  passwordConfirmation: Joi.string()
    .equal(Joi.ref("password "))
    .when("password", {
      is: Joi.any().valid(null, ""),
      then: Joi.optional().allow(null, ""),
      otherwise: Joi.required(),
    })
    .messages({
      "any.only": "Re-Entered password should be same as password",
    }),
});
export const validateFileDownload = Joi.object().keys({
  filename: Joi.string().messages({
    "string.base": `File Name should be a type of string`,
    "string.empty": `File Name cannot be an empty field`,
    "string.max": `File Name can have a maximum length of {#limit}`,
  }),
  code: Joi.number().messages({
    "number.base": `Code should be a type of number`,
    "number.empty": `Code cannot be an empty field`,
    "number.max": `Code can have a maximum length of {#limit}`,
  }),
});
