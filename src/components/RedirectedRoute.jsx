import { useRouter } from "next/router";
import useSWR from "swr";
import toast from "react-hot-toast";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const RedirectedRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    // Data Fetching
    const { data, error, isLoading } = useSWR("/api/auth/check-auth", fetcher);

    // Handle Error
    if (error) toast.error(error.message);

    // Handle Redirect
    if (data?.user) {
      router.replace("/dashboard");
    }

    // Render the wrapped component only if not authenticated
    if (isLoading || !data) {
      return null;
    } else {
      return !data?.user ? <WrappedComponent {...props} /> : null;
    }
  };

  // Return the wrapped component
  return Wrapper;
};

export default RedirectedRoute;
