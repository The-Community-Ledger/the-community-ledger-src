import { useEffect, useState } from "react";
import { useJournalContent } from "@/hooks/useJournalContent";
import ArticleCard from "../article-card";
import { useWallet } from "@/hooks/useWallet";
import styles from "./style.module.css";
import { useIpfsStore } from "@/hooks/useIpfsStore";


// Checks issue, display its content as articles
function IssuePanel({ issue }) {
    const [ articles, setArticles ] = useState([]);
    const { fetchArticlesForIssue } = useJournalContent();
    const { walletConnectionStatus } = useWallet();
    const { fetchIpfsData } = useIpfsStore();
    const [ description, setDescription ] = useState("");

    useEffect(() => {
        const _fetchArticles = async () => {
            const articles = await fetchArticlesForIssue(issue);
            console.log("Fetched articles:", articles);
            if (!articles) return;
            setArticles(articles);
        }
        if (walletConnectionStatus === "connected" && issue) {
            _fetchArticles();
        }
    }, [issue, walletConnectionStatus]);

    useEffect(() => {
      const _fetchIpfsDescription = async () => {
        if ( issue.descriptionIpfsHash === "QmSampleHash" ) return "Sample description";
        const data = await fetchIpfsData(issue.descriptionIpfsHash)
        if (!data) return "Error fetching data";
        return data.content;
      }
      const fetchDescription = async () => {
        const description = await _fetchIpfsDescription();
        setDescription(description);
      }
      fetchDescription();
    }, [issue.descriptionIpfsHash]);

    return (
      <div className={styles.container}>
        <div className={styles.header} > 
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