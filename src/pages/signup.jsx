import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import RedirectedRoute from "@/components/RedirectedRoute";
import Loader from "@/components/Loader/Loader";

import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";

import styles from "./Pages.module.css";

const SignUp = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const { loading, startLoading, stopLoading } = useLoading();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  // Image upload logic
  const handleFileChange = (event) => {
    const image = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image); // base 64 encoding
    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };
  };

  const uploadAdminPicture = async (base64EncodedImage) => {
    try {
      // Upload profile picture to Cloudinary
      const response = await fetch("/api/upload/user/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilePicture: base64EncodedImage }),
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

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const profilePictureUrl = await uploadAdminPicture(profilePicture);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          profilePicture: profilePictureUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        router.push("/dashboard");
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error occurred");
      console.error("Sign-up error:", error);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className={styles.userFormContainer}>
      <h2 className={styles.userFormTitle}>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label className={styles.formLabel}>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.inputField}
        />
        <label className={styles.formLabel}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.inputField}
        />

        <label className={styles.formLabel}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.inputField}
        />

        <label className={styles.formLabel}>Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />

        <button
          type="submit"
          className={`${styles.submitButton} ${styles.blueBtn}`}
        >
          Sign Up
        </button>
      </form>
      {loading && <Loader />}
    </div>
  );
};

export default RedirectedRoute(SignUp);
