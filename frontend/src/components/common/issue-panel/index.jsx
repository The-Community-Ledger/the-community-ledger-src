import { useEffect, useState } from "react";
import { useJournalContent } from "@/hooks/useJournalContent";
import ArticleCard from "../article-card";
import { useWallet } from "@/hooks/useWallet";
import styles from "./style.module.css";


// Checks issue, display its content as articles
function IssuePanel({ issue }) {
    const [ articles, setArticles ] = useState([]);
    const { fetchArticlesForIssue } = useJournalContent();
    const { walletConnectionStatus } = useWallet();

    useEffect(() => {
        const _fetchArticles = async () => {
            const articles = await fetchArticlesForIssue(issue);
            console.log("Fetched articles:", articles);
            setArticles(articles);
        }
        if (walletConnectionStatus) {
            _fetchArticles();
        }
    }, [issue, walletConnectionStatus]);

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>{issue.name}</h3>
          <div className={styles.statusBadge}>
            <p className={styles.statusText}>{issue.isOpen ? "Open" : "Closed"}</p>
          </div>
        </div>
  
        <div className={styles.articlesRow}>
          {articles.length === 0 && <p>No articles yet.</p>}
          {articles.map((article, i) => (
            <div key={i}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>
    );
}

export default IssuePanel;