import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./Pages.module.css";
import Card from "@/components/Card/Card";
import PlusCard from "@/components/Card/PlusCard/PlusCard";
import { articles } from "@/data/articles";

const Dashboard = () => {
  return (
    <div>
      {/* Main Content */}
      <div className={styles.container}>
        {/* Cards Section */}
        <div className={styles.cardsContainer}>
          <>
            <PlusCard />
            {articles.map((article) => (
              <Card
                key={article.id}
                id={article.id}
                title={article.title}
                coverImage={article.coverImage}
                truncatedText={article.truncatedText}
                author={article.author}
                datePublished={article.datePublished}
              />
            ))}
          </>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
