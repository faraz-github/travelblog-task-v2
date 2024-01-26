import { useEffect, useState } from "react";
import styles from "./Pages.module.css";
import Card from "@/components/Card/Card";
import { formatDateIntoMonthNameDateNumberYearNumber } from "../utils/momentUtils";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`/api/blogs/get?page=${page}`);
        const data = await response.json();

        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [page]);

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

        <div>
          <button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button>
          <button onClick={handleNextPage}>Next</button>
        </div>
        {/* <button onClick={handleNextPage}>Next</button> */}
      </div>
    </div>
  );
}
