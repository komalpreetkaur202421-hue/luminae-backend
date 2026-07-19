const express = require("express"); // Import Express.js
const mongoose = require("mongoose");  // Import Mongoose for MongoDB connection
const cors = require("cors"); // <-- ADD THIS: Import CORS package
require("dotenv").config(); // Load environment variables from .env file

const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();  // Create an Express application

// <-- ADD THIS: Tell your backend to allow your frontend to connect
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

const PORT = process.env.PORT || 5000; // Set the port from environment variable or default to 5000

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("This is my server 123");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});