import extractText from "../utils/extractText.js";
import multer from "multer";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

const extractKeywords = (text) => {
  return text
    .toLowerCase()
    .match(/[a-zA-Z]+/g)
    ?.filter((word) => word.length > 3) || [];
};

export const analyzeResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const jobDescription = req.body.jobDescription;

    // ✅ Read file buffer
    const buffer = fs.readFileSync(filePath);

    // ✅ Extract text from PDF
    const resumeText = await extractText(buffer);

    // ✅ Extract keywords
    const resumeKeywords = extractKeywords(resumeText);
    const jdKeywords = extractKeywords(jobDescription);

    // ✅ Missing skills
    const missingSkills = jdKeywords.filter(
      (skill) => !resumeKeywords.includes(skill)
    );

    // ✅ ATS Score
    const score = Math.round(
      ((jdKeywords.length - missingSkills.length) / jdKeywords.length) * 100
    );

    // ✅ Delete uploaded file
    fs.unlinkSync(filePath);

    // ✅ Response (NO AI)
    res.json({
      success: true,
      atsScore: score,
      foundSkills: resumeKeywords,
      missingSkills
    });

  } catch (err) {
    console.log("ATS Error:", err);
    res.status(500).json({ error: "ATS analysis failed" });
  }
};

export const uploadMiddleware = upload.single("resume");
