"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const general_controller_1 = require("../controllers/general.controller");
const router = express_1.default.Router({ mergeParams: true });
router.route("/").get(auth_1.checkApiKey, general_controller_1.checkServerHealth);
exports.default = router;
