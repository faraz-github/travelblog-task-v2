import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import Loader from "@/components/Loader/Loader";
import Comments from "@/components/Comments/Comments";
import Modal from "@/components/Modal/Modal";

import { useLoading } from "@/contexts/LoadingContext";

import { formatDateIntoMonthNameDateNumberYearNumber } from "@/utils/momentUtils";

import styles from "../Pages.module.css";

const BlogPage = () => {
  const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoading();

  const { blogId } = router.query;
  const [blog, setBlog] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        startLoading();
        const response = await fetch(`/api/blog/${blogId}`);
        const data = await response.json();

        if (response.ok) {
          setBlog(data);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error("Error occurred");
        console.error("Error fetching blog:", error);
      } finally {
        stopLoading();
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  return (
    <div className={styles.blogContainer}>
      {blog && (
        <>
          <h1 className={styles.title}>{blog.title}</h1>
          {blog.coverVideo && (
            <div className={styles.coverImage}>
              <Image
                src={blog.coverPicture}
                alt={blog.title}
                width={0}
                height={0}
                sizes="100vw"
                className={styles.coverImage}
                onClick={openModal}
              />
              <div
                className={styles.playButtonOverlay}
                onClick={openModal}
                role="button"
              >
                <p>▶️</p>
              </div>
              {/* Reusable Modal */}
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <video controls autoPlay className={styles.modalVideo}>
                  <source src={blog.coverVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Modal>
            </div>
          )}

          {blog.coverPicture && !blog.coverVideo && (
            <Image
              src={blog.coverPicture}
              alt={blog.title}
              width={0}
              height={0}
              sizes="100vw"
              className={styles.coverPicture}
            />
          )}

          <p className={styles.blogContent}>{blog.blogContent}</p>
          <p className={styles.authorInfo}>Author: {blog.author.name}</p>
          <p className={styles.publishedDate}>
            Date Published:{" "}
            {formatDateIntoMonthNameDateNumberYearNumber(blog.createdAt)}
          </p>

          {/* Render the Comments component */}
          <Comments blogId={blogId} comments={blog.comments} />
        </>
      )}

      {loading && <Loader />}
    </div>
  );
};

export default BlogPage;
