import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

import styles from "./Navbar.module.css";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <nav className={styles.navigation}>
        <div className={styles.left}>
          <Link
            className={`${styles.link} ${
              pathname === "/" && styles.activeLink
            }`}
            href="/"
          >
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
            <>
              <Link
                className={`${styles.link} ${
                  pathname === "/dashboard" && styles.activeLink
                }`}
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link className={styles.link} href="/logout">
                Logout
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
