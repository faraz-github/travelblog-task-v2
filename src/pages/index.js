import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

import Card from "@/components/Card/Card";
import Loader from "@/components/Loader/Loader";

import { formatDateIntoMonthNameDateNumberYearNumber } from "../utils/momentUtils";

import styles from "./Pages.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  const [page, setPage] = useState(1);

  // Data Fetching
  const {
    data: blogs,
    error,
    isLoading,
  } = useSWR(`/api/blogs/get?page=${page}`, fetcher);

  // Handle Loading
  if (isLoading) return <Loader />;

  // Handle Error
  if (blogs.error) console.log(blogs.error); // error defined in api
  if (error) toast.error(error.message);

  // Pagination
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
        {!blogs ? null : (
          <>
            {/* Cards Section */}
            <div className={styles.cardsContainer}>
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
            {/* Pagination */}
            {!isLoading && (
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
                  disabled={
                    blogs.length < 10 || (page !== 1 && blogs.length === 0)
                  }
                  className={`${styles.paginationButton} ${styles.greenBtn}`}
                >
                  Next &#187;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
