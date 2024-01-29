import useSWR from "swr";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/Card/Card";
import PlusCard from "@/components/Card/PlusCard/PlusCard";
import Loader from "@/components/Loader/Loader";

import { formatDateIntoMonthNameDateNumberYearNumber } from "@/utils/momentUtils";

import styles from "./Pages.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Dashboard = () => {
  // Data Fetching
  const { data: blogs, error, isLoading } = useSWR("/api/blogs/user", fetcher);

  // Handle Loading
  if (isLoading) return <Loader />;

  // Handle Error
  if (blogs.error) console.log(blogs.error); // error defined in api
  if (error) toast.error(error.message);

  return (
    <div>
      {/* Main Content */}
      <div className={styles.container}>
        {!blogs ? null : (
          <div className={styles.cardsContainer}>
            <PlusCard />
            {Array.isArray(blogs) &&
              blogs?.map((blog) => (
                <Card
                  key={blog._id}
                  id={blog._id}
                  title={blog.title}
                  coverImage={blog.coverPicture}
                  truncatedText={blog.blogContent.substring(0, 75)}
                  author={blog.author.name}
                  datePublished={formatDateIntoMonthNameDateNumberYearNumber(
                    blog.createdAt
                  )}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
