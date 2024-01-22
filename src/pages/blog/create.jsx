import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import { useRouter } from "next/router";

import styles from "../Pages.module.css";

const CreateBlog = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [coverPicture, setCoverPicture] = useState("");
  const [blogContent, setBlogContent] = useState("");

  // Image upload logic
  const handleFileChange = (event) => {
    const image = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image); // base 64 encoding
    reader.onloadend = () => {
      setCoverPicture(reader.result);
    };
  };

  const uploadAdminPicture = async (base64EncodedImage) => {
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

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    try {
      const coverPictureUrl = await uploadAdminPicture(coverPicture);
      // Replace this with your actual backend API endpoint or data insertion logic
      const response = await fetch("/api/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          coverPicture: coverPictureUrl,
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
          onChange={handleFileChange}
          className={styles.fileInput}
        />

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
