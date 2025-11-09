import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  templateType: String,
  summary: String,
  skills: [String],
  experience: Array,
  projects: Array,
  education: Array,
  atsScore: Number,
});

export default mongoose.model("Resume", resumeSchema);
