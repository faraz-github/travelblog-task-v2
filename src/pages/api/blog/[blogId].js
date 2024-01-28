import Blog from "@/models/Blog";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { blogId } = req.query;

      // Fetch the blog by ID
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      return res.status(200).json(blog);
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
