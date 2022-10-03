"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const auth_2 = require("../validations/auth");
const general_controller_1 = require("../controllers/general.controller");
const general_controller_2 = require("../controllers/user/general.controller");
const helper_1 = require("../utils/helper");
const upload = (0, multer_1.default)({
    storage: helper_1.multerStorage,
});
const router = express_1.default.Router({ mergeParams: true });
router.route("/").get(auth_1.checkApiKey, general_controller_1.checkServerHealth);
router
    .route("/forgotPassword")
    .post(auth_1.checkApiKey, (0, validate_1.validate)(auth_2.forgotPasswordSchema), general_controller_2.forgotPasswordApi);
router
    .route("/resetPassword")
    .put(auth_1.checkApiKey, (0, validate_1.validate)(auth_2.resetPasswordSchema), general_controller_2.resetPasswordApi);
router
    .route("/register")
    .post(auth_1.checkApiKey, (0, validate_1.validate)(auth_2.userRegistrationSchema), general_controller_2.userRegistrationApi);
router
    .route("/update")
    .post(auth_1.checkApiKey, (0, validate_1.validate)(auth_2.userUpdateSchema), general_controller_2.userUpdateApi);
router
    .route("/file")
    .get(auth_1.checkApiKey, auth_1.checkToken, general_controller_2.getFile)
    .post(auth_1.checkApiKey, auth_1.checkToken, upload.single("file"), general_controller_2.uploadFile);
router
    .route("/file/download")
    .post(auth_1.checkApiKey, auth_1.checkToken, (0, validate_1.validate)(auth_2.validateFileDownload), general_controller_2.getUploadedFile);
exports.default = router;
