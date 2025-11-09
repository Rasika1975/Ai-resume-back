import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("Mongo Error:", error);
    process.exit(1);
  }
};

export default connectDB;
