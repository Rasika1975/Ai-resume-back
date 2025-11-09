import express from "express";
import { generateResume, saveResume, getUserResumes } from "../controllers/resumeController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", auth, generateResume);
router.post("/save", auth, saveResume);
router.get("/user/:id", auth, getUserResumes);

export default router;
