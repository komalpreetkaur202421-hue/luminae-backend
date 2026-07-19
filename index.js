const express = require("express"); // Import Express.js
const mongoose = require("mongoose");  // Import Mongoose for MongoDB connection
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();  // Create an Express application
app.use(cors()); 
app.use(express.json());


// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

// Home Route
console.log("Registering profile routes...");
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("This is my server 123");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});