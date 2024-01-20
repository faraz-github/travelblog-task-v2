import { useState } from "react";
import { useRouter } from "next/router";
import RedirectedRoute from "@/components/RedirectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
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
      const imageData = await fetch("/api/upload/user/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilePicture: base64EncodedImage }),
      });

      const { url } = await imageData.json();
      return url;
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
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

      if (response.ok) {
        setIsAuthenticated(true);
        router.push("/dashboard");
      } else {
        console.error("Sign-up failed");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label style={{ display: "block", marginBottom: "10px" }}>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
        />
        <label style={{ display: "block", marginBottom: "10px" }}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
        />

        <label style={{ display: "block", marginBottom: "10px" }}>
          Password:
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "20px", padding: "8px" }}
        />

        <label style={{ display: "block", marginBottom: "10px" }}>
          Profile Picture:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "block", marginBottom: "20px" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default RedirectedRoute(SignUp);
