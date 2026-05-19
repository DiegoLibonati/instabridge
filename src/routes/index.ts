import { Router } from "express";

import healthRoutes from "@/routes/v1/health.route";
import authRoutes from "@/routes/v1/auth.route";
import instagramRoutes from "@/routes/v1/instagram.route";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/instagram", instagramRoutes);

export default router;
