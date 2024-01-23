import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check authentication on the server-side
        const response = await fetch("/api/auth/get-user");
        const data = await response.json();
        if (!response.ok) {
          setIsAuthenticated(false);
          setLoggedInUser(null);
        } else {
          setIsAuthenticated(true);
          setLoggedInUser(data.user);
        }
      } catch (error) {
        console.error("Check auth error:", error);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loggedInUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
