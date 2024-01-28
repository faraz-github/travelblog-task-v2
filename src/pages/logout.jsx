import { useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";

import styles from "./Pages.module.css";

const Logout = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch("/api/auth/logout");

        const data = await response.json();

        if (response.ok) {
          setIsAuthenticated(false);
          router.push("/login");
          toast.success(data.message, {
            id: "logoutSuccessToast", // To prevent duplicate toasts, id is given
          });
        } else {
          toast.error(data.error);
          console.error("Logout failed");
        }
      } catch (error) {
        toast.error("Error occurred");
        console.error("Logout error:", error);
      }
    };

    logout();
  }, [router, setIsAuthenticated]);

  return (
    <div className={styles.userFormContainer}>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
