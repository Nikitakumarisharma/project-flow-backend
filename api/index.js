const express = require("express");
const serverless = require("serverless-http"); // ✅ required for Vercel
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json()); // ✅ for parsing JSON payloads

// ✅ MongoDB connect
mongoose
  .connect(
    "mongodb+srv://niku2003kumari:niku2003@cmtai-crm-cluster.akuljso.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB Atlas connected!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Importing Routes
const Post_route = require("../routes/postRoute");
const userRoutes = require("../routes/userRoute");
const authRoutes = require("../routes/authRoute");
const projectRoutes = require("../routes/projectRoute");

// ✅ Routes middleware
app.use("/api", Post_route);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

module.exports = serverless(app);
