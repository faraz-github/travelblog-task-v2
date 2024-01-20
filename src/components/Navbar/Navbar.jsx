import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  console.log({ pathname });

  return (
    <nav className={styles.navigation}>
      <div className={styles.left}>
        <Link className={styles.link} href="/">
          Home
        </Link>
      </div>
      <div className={styles.right}>
        {!isAuthenticated && (
          <>
            {pathname !== "/signup" && (
              <Link className={styles.link} href="/signup">
                Sign Up
              </Link>
            )}
            {pathname !== "/login" && (
              <Link className={styles.link} href="/login">
                Login
              </Link>
            )}
          </>
        )}
        {isAuthenticated && (
          <Link className={styles.link} href="/logout">
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
