import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Pages.module.css";

const Logout = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (response.ok) {
          setIsAuthenticated(false);
          router.push("/login");
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    logout();
  }, [router]);

  return (
    <div className={styles.userFormContainer}>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
