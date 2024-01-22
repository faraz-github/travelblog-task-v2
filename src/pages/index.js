import { useEffect, useState } from "react";
import styles from "./Pages.module.css";
import Card from "@/components/Card/Card";
import { formatDateIntoMonthNameDateNumberYearNumber } from "../utils/momentUtils";

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs/get");
        const data = await response.json();

        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

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
      </div>
    </div>
  );
}
