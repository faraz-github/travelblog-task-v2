import path from "path";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { parse } from "cookie";

const SECRET = process.env.JWT_SECRET;
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week in seconds

const usersFilePath = path.join(process.cwd(), "src", "data", "users.json");

const signUp = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { email, password } = req.body;

    // Perform password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO save user in mongodb
    // Save user data to a JSON file (this is just for demonstration purposes)
    // In a production environment, you would use a database.
    // Read the existing users data or initialize with an empty array
    const existingUsersData = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(existingUsersData || "[]");

    users.push({ email, password: hashedPassword });

    // Save user data to the users.json file
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

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
