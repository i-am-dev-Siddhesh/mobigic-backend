import express from "express";

import { checkApiKey } from "../middlewares/auth";

import { checkServerHealth } from "../controllers/general.controller";

 
const router = express.Router({ mergeParams: true });

router.route("/").get(checkApiKey, checkServerHealth);

export default router;
