import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import User from "@/models/User";

const SECRET = process.env.JWT_SECRET;
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week in seconds

const signUp = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { name, email, password, profilePicture } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Perform password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      profilePicture: profilePicture,
    });

    // Create a JWT token
    const token = sign({ email }, SECRET, { expiresIn: "1d" });

    // Set a cookie with the token
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Max-Age=${MAX_AGE}; HttpOnly; Path=/`
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default signUp;
