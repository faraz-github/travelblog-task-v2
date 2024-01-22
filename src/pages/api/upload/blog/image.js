import cloudinary from "@/config/cloudinaryUploader";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { coverPicture } = req.body;
    const uploadedResponse = await cloudinary.uploader.upload(coverPicture, {
      folder: "TravelBlog-Task/Blogs/Image",
    });

    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
