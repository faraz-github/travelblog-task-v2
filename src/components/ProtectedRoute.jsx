import { useRouter } from "next/router";
import useSWR from "swr";
import toast from "react-hot-toast";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const ProtectedRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    // Data Fetching
    const { data, error, isLoading } = useSWR("/api/auth/check-auth", fetcher);

    // Handle Error
    if (data?.error) router.replace("/login"); // error defined in api
    if (error) toast.error(error.message);

    // Render the wrapped component only if authenticated
    if (isLoading || !data) {
      return null;
    } else {
      return data?.user ? <WrappedComponent {...props} /> : null;
    }
  };

  // Return the wrapped component
  return Wrapper;
};

export default ProtectedRoute;
