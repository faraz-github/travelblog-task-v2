import Link from "next/link";

import styles from "./PlusCard.module.css";

const PlusCard = () => {
  return (
    <Link href={`/blog/create`} className={`${styles.card} ${styles.plusCard}`}>
      <h1 className={styles.plus}>+</h1>
    </Link>
  );
};

export default PlusCard;
