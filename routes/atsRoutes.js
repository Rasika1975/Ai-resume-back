import express from "express";
import { analyzeResume, uploadMiddleware } from "../controllers/atsController.js";

const router = express.Router();

// ✅ Multer middleware lagana mandatory
router.post("/analyze", uploadMiddleware, analyzeResume);

export default router;
