import Blog from "@/models/Blog";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Auth Check
      // Retrieve the token from the request cookies
      const cookies = parse(req.headers.cookie || "");
      const token = cookies.token;

      // If the token is not present, the user is not authenticated
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Verify the token using the secret key
      const decodedToken = verify(token, SECRET);
      const { email } = decodedToken;

      // Fetch all blogs from the database for the logged in user
      const userBlogs = await Blog.find({ "author.email": email }).sort({
        createdAt: -1,
      });

      return res.status(200).json(userBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
