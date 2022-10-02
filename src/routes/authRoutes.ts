import express from "express";
import {
    loginApi,
    logoutApi,
    me
} from "../controllers/user/auth.controller";

import { checkApiKey, checkToken } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../validations/auth";

const router = express.Router({ mergeParams: true });

router.route("/user/login").post(checkApiKey, validate(loginSchema), loginApi);
router.route("/user/logout").put(checkApiKey, checkToken, logoutApi);
router.route("/user/me").get(checkApiKey, checkToken, me);

export default router;
