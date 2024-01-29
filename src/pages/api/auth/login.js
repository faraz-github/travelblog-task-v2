import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import User from "@/models/User";

const SECRET = process.env.JWT_SECRET;
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week in seconds

const login = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if the password is correct
    if (!(await bcrypt.compare(password, existingUser.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a JWT token
    const token = sign({ email }, SECRET, { expiresIn: "1d" });

    // Set a cookie with the token
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Max-Age=${MAX_AGE}; HttpOnly; Path=/`
    );

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default login;
