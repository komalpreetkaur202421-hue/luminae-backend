const User = require("../models/User");   // Import the User model from the models directory 
const bcrypt = require("bcrypt");   // Import bcrypt for password hashing 
const jwt = require("jsonwebtoken");   // Import jsonwebtoken for generating JWT tokens

//register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

if (existingUser) {
  return res.status(400).json({
    message: "Email already exists",
  });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Original Password:", password);
    console.log("Hashed Password:", hashedPassword);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

  res.status(201).json({
  message: "User Registered Successfully",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login User 
const loginUser = async (req, res) => {
   console.log("🔥 Login API called");

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }

};

module.exports = {
  registerUser,
  loginUser,
};