import express from "express";
import multer from "multer";

import { checkApiKey, checkToken } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  userRegistrationSchema,
  userUpdateSchema,
  validateFileDownload,
} from "../validations/auth";

import { checkServerHealth } from "../controllers/general.controller";
import {
  forgotPasswordApi,
  getFile,
  getUploadedFile,
  resetPasswordApi,
  uploadFile,
  userRegistrationApi,
  userUpdateApi,
} from "../controllers/user/general.controller";
import { multerStorage } from "../utils/helper";

const upload = multer({
  storage: multerStorage,
});
const router = express.Router({ mergeParams: true });

router.route("/").get(checkApiKey, checkServerHealth);

router
  .route("/forgotPassword")
  .post(checkApiKey, validate(forgotPasswordSchema), forgotPasswordApi);

router
  .route("/resetPassword")
  .put(checkApiKey, validate(resetPasswordSchema), resetPasswordApi);

router
  .route("/register")
  .post(checkApiKey, validate(userRegistrationSchema), userRegistrationApi);

router
  .route("/update")
  .post(checkApiKey, validate(userUpdateSchema), userUpdateApi);

router
  .route("/file")
  .get(checkApiKey, checkToken, getFile)
  .post(checkApiKey, checkToken, upload.single("file"), uploadFile);

router
  .route("/file/download")
  .post(
    checkApiKey,
    checkToken,
    validate(validateFileDownload),
    getUploadedFile
  );

export default router;
