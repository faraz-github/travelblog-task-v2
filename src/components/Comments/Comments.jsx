import { useState } from "react";
import CommentBox from "../CommentBox/CommentBox";
import {
  formatDateIntoMonthNameDateNumberYearNumber,
  formatObjectIdIntoMonthNameDateNumberYearNumber,
} from "@/utils/momentUtils";
import styles from "./Comments.module.css";
import { useAuth } from "@/contexts/AuthContext";

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

      if (!response.ok) {
        console.error("Error posting comment:", response.statusText);
      } else {
        const newComment = await response.json();

        // Update the local state with the new comment
        setLocalCommentsState((prevState) => [
          ...prevState,
          newComment.lastComment,
        ]);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <h2 className={styles.title}>Comments</h2>
      {localCommentState.map((comment, index) => (
        <div key={comment._id || index} className={styles.comment}>
          <img
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
        <p>Login to comment</p>
      )}
    </div>
  );
};

export default Comments;
