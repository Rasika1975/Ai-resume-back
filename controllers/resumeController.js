import client from "../utils/openai.js";
import Resume from "../models/Resume.js";

export const generateResume = async (req, res) => {
  const { name, skills, experience, projects, education } = req.body;

  const prompt = `
Generate an ATS-friendly resume in JSON:
{
 summary,
 skills,
 experience,
 projects,
 education
}
Based on:
Name: ${name}
Skills: ${skills}
Experience: ${experience}
Projects: ${projects}
Education: ${education}
`;

  const aiRes = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  res.json(JSON.parse(aiRes.choices[0].message.content));
};

export const saveResume = async (req, res) => {
  const resume = await Resume.create(req.body);
  res.json(resume);
};

export const getUserResumes = async (req, res) => {
  const resumes = await Resume.find({ userId: req.params.id });
  res.json(resumes);
};
