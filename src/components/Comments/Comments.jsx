import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import CommentBox from "../CommentBox/CommentBox";

import { useAuth } from "@/contexts/AuthContext";

import { formatObjectIdIntoMonthNameDateNumberYearNumber } from "@/utils/momentUtils";

import styles from "./Comments.module.css";

const Comments = ({ blogId, comments }) => {
  const { isAuthenticated, loggedInUser } = useAuth();

  const [localCommentState, setLocalCommentsState] = useState(comments);

  const handlePostComment = async (comment) => {
    const payload = {
      comment: comment,
      authorName: loggedInUser.name,
      profilePicture: loggedInUser.profilePicture,
    };

    try {
      const response = await fetch(`/api/blog/comment/${blogId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the local state with the new comment
        setLocalCommentsState((prevState) => [...prevState, data.lastComment]);
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error occurred");
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <h2 className={styles.title}>Comments</h2>
      {localCommentState.map((comment, index) => (
        <div key={comment._id || index} className={styles.comment}>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            src={comment.author.profilePicture}
            alt={comment.author.name}
            className={styles.avatar}
          />
          <div>
            <p className={styles.commentAuthor}>{comment.author.name}</p>
            <p className={styles.commentText}>{comment.comment}</p>
            <p className={styles.commentDate}>
              {formatObjectIdIntoMonthNameDateNumberYearNumber(comment._id)}
            </p>
          </div>
        </div>
      ))}
      {isAuthenticated && loggedInUser ? (
        <CommentBox loggedInUser={loggedInUser} onSubmit={handlePostComment} />
      ) : (
        <p>
          <Link href={"/login"} style={{ textDecoration: "underline" }}>
            Login
          </Link>{" "}
          to comment
        </p>
      )}
    </div>
  );
};

export default Comments;
