import { verify } from "jsonwebtoken";
import { parse } from "cookie";
import User from "@/models/User";
import Blog from "@/models/Blog";

const SECRET = process.env.JWT_SECRET;

const create = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { title, coverPicture, blogContent } = req.body;

    // Auth Check
    // Retrieve the token from the request cookies
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    // If the token is not present, the user is not authenticated
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Author Info
    // Verify the token using the secret key
    const decodedToken = verify(token, SECRET);
    const { email } = decodedToken;
    // Check if the username already exists
    const existingUser = await User.findOne({ email }).select("-password");
    const { name, profilePicture } = existingUser;

    // Create a new blog
    await Blog.create({
      title: title,
      coverPicture: coverPicture,
      blogContent: blogContent,
      author: { name, email, profilePicture },
    });

    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default create;