import path from "path";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { parse } from "cookie";

const SECRET = process.env.JWT_SECRET;
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week in seconds

const usersFilePath = path.join(process.cwd(), "src", "data", "users.json");

const login = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { email, password } = req.body;

    // TODO retrieve user from mongodb
    // Retrieve user data from the JSON file (this is just for demonstration purposes)
    // In a production environment, you would use a database.
    // Read the existing users data or initialize with an empty array
    const existingUsersData = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(existingUsersData || "[]");

    const user = users.find((u) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default login;
