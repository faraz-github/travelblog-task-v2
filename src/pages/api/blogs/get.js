import Blog from "@/models/Blog";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = 10; // Number of blogs per page

      // Calculate skip value based on page
      const skip = (page - 1) * limit;
      // Fetch all blogs from the database
      const blogs = await Blog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
