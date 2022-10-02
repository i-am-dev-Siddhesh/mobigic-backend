"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkServerHealth = void 0;
const constants_1 = require("../utils/constants");
const errorResponse_1 = require("../utils/errorResponse");
// @desc    Check Server Health
// @route   GET /v1/
// @access  Public
const checkServerHealth = (_req, res) => {
    try {
        return res
            .status(200)
            .json({ status: true, message: constants_1.SERVER_RUNNING_MESSAGE });
    }
    catch (error) {
        return res.status(500).json((0, errorResponse_1.generalError)(error));
    }
};
exports.checkServerHealth = checkServerHealth;
