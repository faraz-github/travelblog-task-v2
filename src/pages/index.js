import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Card from "@/components/Card/Card";
import Loader from "@/components/Loader/Loader";

import { useLoading } from "@/contexts/LoadingContext";
import { formatDateIntoMonthNameDateNumberYearNumber } from "../utils/momentUtils";

import styles from "./Pages.module.css";

export default function Home() {
  const { loading, startLoading, stopLoading } = useLoading();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [disableNext, setDisableNext] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        startLoading();
        const response = await fetch(`/api/blogs/get?page=${page}`);
        const data = await response.json();
        if (response.ok) {
          if (page !== 1 && data.length === 0) {
            toast.error("It looks like you've reached the end");
            setDisableNext(true);
          } else {
            setDisableNext(false);
          }
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
  }, [page, startLoading, stopLoading]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div>
      {/* Main Content */}
      <div className={styles.container}>
        {/* Cards Section */}
        <div className={styles.cardsContainer}>
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
        {/* Pagination */}
        {!loading && (
          <div className={styles.paginationContainer}>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`${styles.paginationButton} ${styles.redBtn}`}
            >
              &#171; Prev
            </button>
            <button
              onClick={handleNextPage}
              disabled={disableNext || blogs.length < 10}
              className={`${styles.paginationButton} ${styles.greenBtn}`}
            >
              Next &#187;
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && <Loader />}
      </div>
    </div>
  );
}
