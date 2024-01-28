import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProtectedRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // Check authentication on the server-side
          const response = await fetch("/api/auth/check-auth");
          const data = await response.json();

          if (!response.ok) {
            // If not authenticated, redirect to the login page on the server
            router.replace("/login");
          } else {
            // If authenticated, set the state to true
            setAuthenticated(true);
          }
        } catch (error) {
          console.error("Check auth error:", error);
        }
      };

      checkAuth();
    }, [router]);

    // Render the wrapped component only if authenticated
    return authenticated ? <WrappedComponent {...props} /> : null;
  };

  // Return the wrapped component
  return Wrapper;
};

export default ProtectedRoute;
