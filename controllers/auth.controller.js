const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { fname, email, password } = req.body;

    const user = new User({ fname, email, password });
    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: { [field]: `${field} already exists` },
      });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { signup, login };
