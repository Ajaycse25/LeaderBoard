import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import User from "./models/User.js";

dotenv.config();
const app = express();
const server = http.createServer(app);


const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map(s => s.trim())
  : ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});
app.locals.io = io;

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});


app.use("/api/users", userRoutes);
app.use("/api/claim", claimRoutes);


app.get("/", (_req, res) => res.send("Leaderboard API is running"));

const PORT = process.env.PORT || 5000;

async function seedUsersIfNeeded() {
  const count = await User.countDocuments();
  if (count === 0) {
    const names = ["Rahul", "Kamal", "Sanak", "Anita", "Vikram", "Neha", "Arjun", "Priya", "Rohit", "Meera"];
    const docs = names.map(name => ({ name }));
    await User.insertMany(docs);
  }
}

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await seedUsersIfNeeded();
    server.listen(PORT, () => {
      console.log(` Server is running`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();
