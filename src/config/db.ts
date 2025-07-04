import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/weatherdb";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Conectado");
  } catch (error) {
    console.error("MongoDB error de conexion:", error);
    process.exit(1);
  }
};