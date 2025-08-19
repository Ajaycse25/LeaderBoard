import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) throw new Error("Missing MONGO_URI");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "leaderboard_db" });
  console.log("✅ MongoDB connected");
}
