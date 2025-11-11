import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Updated CORS Configuration for Production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://resumebuilder-silk-rho.vercel.app',  // Your Vercel frontend
  'https://ai-resume-back-1.onrender.com'       // Your Render backend
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with increased limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ TEST ROUTE - Very Important!
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend Running',
    routes: ['/auth', '/resume', '/ats', '/pdf'],
    allowedOrigins: allowedOrigins
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/resume", resumeRoutes);
app.use("/ats", atsRoutes);
app.use("/pdf", pdfRoutes);

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
  console.log(`🌐 Allowed Origins:`, allowedOrigins);
});