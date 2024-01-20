import { useState } from "react";
import { useRouter } from "next/router";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/login");
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

export default SignUp;
