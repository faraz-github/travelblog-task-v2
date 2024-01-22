import Blog from "@/models/Blog";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Fetch all blogs from the database
      const blogs = await Blog.find();

      return res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
