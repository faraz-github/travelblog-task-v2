import { useState } from "react";
import { useRouter } from "next/router";
import RedirectedRoute from "@/components/RedirectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Pages.module.css";

const Login = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        router.push("/dashboard");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className={styles.userFormContainer}>
      <h2 className={styles.userFormTitle}>Login</h2>
      <form onSubmit={handleLogin}>
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

        <button
          type="submit"
          className={`${styles.submitButton} ${styles.greenBtn}`}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default RedirectedRoute(Login);
