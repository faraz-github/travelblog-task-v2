import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { formatDateIntoMonthNameDateNumberYearNumber } from "@/utils/momentUtils";

import Comments from "@/components/Comments/Comments";
import styles from "../Pages.module.css";

const BlogPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Replace this with your actual backend API endpoint or data fetching logic
        const response = await fetch(`/api/blog/${id}`);
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (!blog) {
    // You can render a loading state or redirect to a 404 page if the blog is not found
    return <p>Loading blog {id}...</p>;
  }

  return (
    <div className={styles.blogContainer}>
      <h1 className={styles.title}>{blog.title}</h1>
      <Image
        src={blog.coverPicture}
        alt={blog.title}
        width={0}
        height={0}
        sizes="100vw"
        className={styles.coverPicture}
      />
      <p className={styles.blogContent}>{blog.blogContent}</p>
      <p className={styles.authorInfo}>Author: {blog.author.name}</p>
      <p className={styles.publishedDate}>
        Date Published:{" "}
        {formatDateIntoMonthNameDateNumberYearNumber(blog.createdAt)}
      </p>

      {/* Render the Comments component */}
      <Comments blogId={id} comments={blog.comments} />
    </div>
  );
};

export default BlogPage;
