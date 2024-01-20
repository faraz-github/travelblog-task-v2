import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

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
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
