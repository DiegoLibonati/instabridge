import Router from "express";

import { AuthController } from "@/controllers/auth.controller";

import { verifyAccessToken } from "@/middlewares/verify_access_token.middleware";

const router = Router();

router.get("/user_id", verifyAccessToken, AuthController.getUserId);

export default router;
