import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});