import Router from "express";

import { InstagramController } from "@/controllers/instagram.controller";

import { verifyIdUser } from "@/middlewares/verify_id_user.middleware";
import { verifyAccessToken } from "@/middlewares/verify_access_token.middleware";

const router = Router();

router.get("/alive", verifyAccessToken, verifyIdUser, InstagramController.alive);
router.get("/user/profile", verifyAccessToken, verifyIdUser, InstagramController.userProfile);

export default router;
