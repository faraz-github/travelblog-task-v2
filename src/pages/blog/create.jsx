import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import { useRouter } from "next/router";

import styles from "../Pages.module.css";

const CreateBlog = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [coverPicture, setCoverPicture] = useState("");
  const [coverVideo, setCoverVideo] = useState(null);
  const [coverVideoUrl, setCoverVideoUrl] = useState("");
  const [blogContent, setBlogContent] = useState("");

  const [videoUploading, setVideoUploading] = useState(false);

  // Image upload logic
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image); // base 64 encoding
    reader.onloadend = () => {
      setCoverPicture(reader.result);
    };
  };

  const uploadCoverPicture = async (base64EncodedImage) => {
    try {
      // Upload profile picture to Cloudinary
      const imageData = await fetch("/api/upload/blog/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coverPicture: base64EncodedImage }),
      });

      const { url } = await imageData.json();
      return url;
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  // Video upload logic
  const handleVideoChange = (event) => {
    setCoverVideo(event.target.files[0]);
  };

  const handleVideoUpload = async (event) => {
    event.preventDefault();
    setVideoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", coverVideo);

      const response = await fetch("/api/upload/blog/video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setVideoUploading(false);
        const { url } = await response.json();
        setCoverVideoUrl(url);
      } else {
        setVideoUploading(false);
        console.error("Video upload failed");
      }
    } catch (error) {
      setVideoUploading(false);
      console.error("Error uploading video:", error);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (coverVideo && !coverVideoUrl) {
      console.error("Please upload the video first");
      return;
    }

    try {
      const coverPictureUrl = await uploadCoverPicture(coverPicture);
      // Replace this with your actual backend API endpoint or data insertion logic
      const response = await fetch("/api/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          coverPicture: coverPictureUrl,
          coverVideo: coverVideoUrl,
          blogContent,
        }),
      });

      if (response.ok) {
        // Redirect to the dashboard or the newly created blog page
        router.push("/dashboard");
      } else {
        console.error("Blog creation failed");
      }
    } catch (error) {
      console.error("Blog creation error:", error);
    }
  };

  return (
    <div className={styles.blogFormContainer}>
      <h2 className={styles.blogFormTitle}>Create Blog</h2>
      <form onSubmit={handleCreateBlog}>
        <label className={styles.formLabel}>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.inputField}
        />

        <label className={styles.formLabel}>Cover Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />

        <label className={styles.formLabel}>Cover Video:</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className={styles.fileInput}
        />
        <button
          className={`${styles.uploadButton} ${styles.greenBtn}`}
          onClick={handleVideoUpload}
          disabled={!coverVideo || videoUploading}
        >
          {videoUploading && !coverVideoUrl
            ? "Uploading..."
            : !coverVideoUrl
            ? "Upload Video"
            : "Uploaded"}
        </button>

        <label className={styles.formLabel}>Blog Content:</label>
        <textarea
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
          required
          className={styles.textareaField}
        ></textarea>

        <button
          type="submit"
          className={`${styles.submitButton} ${styles.blueBtn}`}
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default ProtectedRoute(CreateBlog);
