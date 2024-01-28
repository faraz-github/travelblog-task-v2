import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import RedirectedRoute from "@/components/RedirectedRoute";
import Loader from "@/components/Loader/Loader";

import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";

import styles from "./Pages.module.css";

const Login = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const { loading, startLoading, stopLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
      console.error("Login error:", error);
    } finally {
      stopLoading();
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
      {loading && <Loader />}
    </div>
  );
};

export default RedirectedRoute(Login);
