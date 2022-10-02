"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/user/auth.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const auth_2 = require("../validations/auth");
const router = express_1.default.Router({ mergeParams: true });
router.route("/user/login").post(auth_1.checkApiKey, (0, validate_1.validate)(auth_2.loginSchema), auth_controller_1.loginApi);
router.route("/user/logout").put(auth_1.checkApiKey, auth_1.checkToken, auth_controller_1.logoutApi);
router.route("/user/me").get(auth_1.checkApiKey, auth_1.checkToken, auth_controller_1.me);
exports.default = router;
