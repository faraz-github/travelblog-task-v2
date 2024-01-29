import { useRouter } from "next/router";
import toast from "react-hot-toast";

import styles from "./Pages.module.css";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout");

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
        toast.success(data.message);
      } else {
        toast.error(data.error);
        console.error("Logout failed");
      }
    } catch (error) {
      toast.error("Error occurred");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={styles.userFormContainer}>
      <p>Logging out...</p>
      <center>
        <button
          onClick={handleLogout}
          className={`${styles.submitButton} ${styles.redBtn}`}
        >
          Log Out
        </button>
      </center>
    </div>
  );
};

export default Logout;
