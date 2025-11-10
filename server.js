import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js"; // ✅ IMPORT THIS

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser with increased limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ TEST ROUTE - Very Important!
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend Running',
    routes: ['/auth', '/resume', '/ats', '/pdf']
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/resume", resumeRoutes);
app.use("/ats", atsRoutes);
app.use("/pdf", pdfRoutes); // ✅ ADD THIS LINE

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Routes available:`);
  console.log(`   - POST http://localhost:${PORT}/pdf/generate`);
});