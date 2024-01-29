import { createContext, useContext } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

import Loader from "@/components/Loader/Loader";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Data Fetching
  const { data, error, isLoading } = useSWR("/api/auth/get-user", fetcher, {
    refreshInterval: 500,
  });

  // Handle Loading
  if (isLoading) return <Loader />;

  // Handle Error
  if (data.error) console.log(data.error); // error defined in api
  if (error) toast.error(error.message);

  const isAuthenticated = data.user ? true : false;
  const loggedInUser = data.user ? data.user : null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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
