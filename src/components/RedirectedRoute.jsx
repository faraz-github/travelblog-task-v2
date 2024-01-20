import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const RedirectedRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch("/api/auth/check-auth");

          if (response.ok) {
            // If authenticated, redirect to the protected page
            router.replace("/dashboard");
          } else {
            // If not authenticated, set the state to false
            setAuthenticated(false);
          }
        } catch (error) {
          console.error("Check auth error:", error);
        }
      };

      checkAuth();
    }, [router]);

    // Render the wrapped component only if not authenticated
    return !authenticated ? <WrappedComponent {...props} /> : null;
  };

  // Return the wrapped component
  return Wrapper;
};

export default RedirectedRoute;
