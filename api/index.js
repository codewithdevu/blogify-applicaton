import "dotenv/config";
import mongoose from "mongoose";
import app from "../app.js";

mongoose.connect(process.env.MONGO_URL);

export default app;