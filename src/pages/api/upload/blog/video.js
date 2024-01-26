import { IncomingForm } from "formidable";
import cloudinary from "@/config/cloudinaryUploader";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle FormData
    externalResolver: true, // To disable warning API resolved without sending a response
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const form = new IncomingForm();

    // Parse the incoming form data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
      const file = files.file[0]; // Access the first uploaded file

      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
      }

      // Access file details
      const filepath = file.filepath;

      // Upload the file to Cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(filepath, {
        resource_type: "video",
        folder: "TravelBlog-Task/Blogs/Video",
      });
      res.status(200).json({ url: uploadedResponse.secure_url });
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
