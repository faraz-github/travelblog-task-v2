import { parse } from "cookie";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  const { blogId } = req.query;

  if (req.method === "POST") {
    try {
      const { comment, authorName, profilePicture } = req.body;

      // Auth Check
      // Retrieve the token from the request cookies
      const cookies = parse(req.headers.cookie || "");
      const token = cookies.token;

      // If the token is not present, the user is not authenticated
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const payload = {
        comment: comment,
        author: {
          name: authorName,
          profilePicture: profilePicture,
        },
      };

      const response = await Blog.updateOne(
        { _id: blogId },
        { $push: { comments: payload } }
      );
      if (response.acknowledged == true) {
        // Find the latest comments
        const response = await Blog.findOne({ _id: blogId }, "comments");
        const latestComments = response.comments;
        const lastComment = latestComments[latestComments.length - 1];

        // Return latest comment along with response
        res.status(201).json({
          message: "Comment posted successfully",
          lastComment: lastComment,
        });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
