import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader/Loader";

import { useLoading } from "@/contexts/LoadingContext";

import styles from "../Pages.module.css";

const CreateBlog = () => {
  const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoading();
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
      const response = await fetch("/api/upload/blog/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coverPicture: base64EncodedImage }),
      });

      const data = await response.json();
      if (response.ok) {
        return data.url;
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error occurred");
      console.error("Upload error:", error);
    }
  };

  // Video upload logic
  const handleVideoChange = (event) => {
    setCoverVideo(event.target.files[0]);
  };

  const handleVideoUpload = async (event) => {
    event.preventDefault();

    if (coverVideoUrl !== "") {
      toast.success("File already uploaded 🎉");
      return;
    }

    try {
      setVideoUploading(true);
      const formData = new FormData();
      formData.append("file", coverVideo);

      const response = await fetch("/api/upload/blog/video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setCoverVideoUrl(data.url);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error occurred");
      console.error("Error uploading video:", error);
    } finally {
      setVideoUploading(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (coverVideo && !coverVideoUrl) {
      toast.error("Please upload the video first");
      return;
    }

    try {
      startLoading();
      const coverPictureUrl = await uploadCoverPicture(coverPicture);

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

      const data = await response.json();
      if (response.ok) {
        // Redirect to the dashboard or the newly created blog page
        router.push("/dashboard");
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error occurred");
      console.error("Blog creation error:", error);
    } finally {
      stopLoading();
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

        <label className={styles.formLabel}>Cover Video (Optional):</label>
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
          {videoUploading && !coverVideoUrl ? (
            "Uploading..."
          ) : !coverVideoUrl ? (
            "Upload Video"
          ) : (
            <p>Uploaded &#10004;</p>
          )}
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
          Publish
        </button>
      </form>
      {loading && <Loader />}
    </div>
  );
};

export default ProtectedRoute(CreateBlog);
