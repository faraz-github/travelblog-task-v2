import Link from "next/link";
import Image from "next/image";

import styles from "./Card.module.css";

const Card = ({
  id,
  title,
  coverImage,
  truncatedText,
  author,
  datePublished,
}) => {
  return (
    <Link
      key={id}
      href={`/blogs/${id}`}
      className={`${styles.card} ${styles.articleCard}`}
    >
      <div className={styles.articleCardContent}>
        <Image
          className={styles.articleCoverImage}
          src={coverImage}
          alt={title}
          width={0}
          height={0}
          sizes="100vw"
        />
        <div className={styles.articleContent}>
          <h3 className={styles.articleTitle}>{title}</h3>
          <p>{`${truncatedText}...`}</p>
          <button className={styles.readMoreButton}>Read More</button>
          <div className={styles.authorDetails}>
            <p>{author}</p>
            <p>{datePublished}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
