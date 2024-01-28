import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/Card/Card";
import PlusCard from "@/components/Card/PlusCard/PlusCard";
import Loader from "@/components/Loader/Loader";

import { useLoading } from "@/contexts/LoadingContext";

import { formatDateIntoMonthNameDateNumberYearNumber } from "@/utils/momentUtils";

import styles from "./Pages.module.css";

const Dashboard = () => {
  const { loading, startLoading, stopLoading } = useLoading();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        startLoading();
        const response = await fetch("/api/blogs/user");
        const data = await response.json();
        if (response.ok) {
          setBlogs(data);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error("Error occurred");
        console.error("Error fetching blogs:", error);
      } finally {
        stopLoading();
      }
    };

    fetchBlogs();
  }, [startLoading, stopLoading]);

  return (
    <div>
      {/* Main Content */}
      <div className={styles.container}>
        {/* Cards Section */}
        <div className={styles.cardsContainer}>
          <PlusCard />
          {blogs.map((blog) => (
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
      </div>
      {/* Loading */}
      {loading && <Loader />}
    </div>
  );
};

export default ProtectedRoute(Dashboard);
