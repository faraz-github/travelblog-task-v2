import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import toast from "react-hot-toast";

import Loader from "@/components/Loader/Loader";
import Comments from "@/components/Comments/Comments";
import Modal from "@/components/Modal/Modal";

import { formatDateIntoMonthNameDateNumberYearNumber } from "@/utils/momentUtils";

import styles from "../Pages.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const BlogPage = () => {
  const router = useRouter();

  const { blogId } = router.query;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Data Fetching
  const {
    data: blog,
    error,
    isLoading,
  } = useSWR(`/api/blog/${blogId}`, fetcher);

  // Handle Loading
  if (isLoading) return <Loader />;

  // Handle Error
  if (blog.error) toast.error(blog.error); // error defined in api
  if (error) toast.error(error.message);

  return (
    <>
      {!blog ? null : (
        <div className={styles.blogContainer}>
          <h1 className={styles.title}>{blog?.title}</h1>
          {blog?.coverVideo && (
            <div className={styles.coverImage}>
              <Image
                src={blog?.coverPicture}
                alt={blog?.title}
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
                  <source src={blog?.coverVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Modal>
            </div>
          )}

          {blog?.coverPicture && !blog?.coverVideo && (
            <Image
              src={blog?.coverPicture}
              alt={blog?.title}
              width={0}
              height={0}
              sizes="100vw"
              className={styles.coverPicture}
            />
          )}

          <p className={styles.blogContent}>{blog?.blogContent}</p>
          <p className={styles.authorInfo}>Author: {blog?.author.name}</p>
          <p className={styles.publishedDate}>
            Date Published:{" "}
            {formatDateIntoMonthNameDateNumberYearNumber(blog?.createdAt)}
          </p>

          {/* Render the Comments component */}
          <Comments blogId={blogId} comments={blog?.comments} />
        </div>
      )}
    </>
  );
};

export default BlogPage;
