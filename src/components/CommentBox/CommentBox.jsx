import { useState } from "react";
import Image from "next/image";

import styles from "./CommentBox.module.css";

const CommentBox = ({ loggedInUser, onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
    setComment("");
  };

  return (
    <div className={styles.commentBox}>
      <Image
        width={0}
        height={0}
        sizes="100vw"
        src={loggedInUser.profilePicture}
        alt={loggedInUser.name}
        className={styles.avatar}
      />
      <div className={styles.fullWithInput}>
        <form onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className={styles.commentInput}
          />
          <button type="submit" className={styles.postButton}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentBox;
