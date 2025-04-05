import { useEffect, useState } from "react";
import { useJournalContent } from "@/hooks/useJournalContent";
import ArticleCard from "../article-card";
import { useWallet } from "@/hooks/useWallet";
import styles from "./style.module.css";
import { useIpfsStore } from "@/hooks/useIpfsStore";
import MarkdownModal from "../markdown-modal";


// Checks issue, display its content as articles
function IssuePanel({ issue }) {
    const [ articles, setArticles ] = useState([]);
    const { fetchArticlesForIssue } = useJournalContent();
    const { walletConnectionStatus } = useWallet();
    const { fetchIpfsData, storeIpfsData } = useIpfsStore();
    const [ modalOpen, setModalOpen ] = useState(false);    
    const [ submitError, setSubmitError ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ submittedContent, setSubmittedContent ] = useState("");

    // Fetch articles for the issue
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

    // Handle markdown submit
    const handleSubmit = async (md) => {
        console.log("Submitting markdown:", md);
        setIsLoading(true);
        try {
            const cid = await storeIpfsData({ content: md });
            console.log("Stored IPFS data with CID:", cid);
            setIsSubmitted(true);
            setSubmitError('');
        } catch (error) {
            setSubmitError("Error storing IPFS data:", error);
        }
        setIsLoading(false);
    }

    return (
      <>
        <MarkdownModal
          isOpen={modalOpen}
          isSubmitted={isSubmitted}
          isLoading={isLoading}
          error={submitError}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          title={"Submit an article to " + issue.name}
          initialValue=""
         />

        <div className={styles.container}>
          <div className={styles.header} > 
            <h3 className={styles.title}>{issue.name}</h3>
            <div className={styles.statusBadge} style={{backgroundColor: issue.isOpen ? 'green' : 'red' }}>
              <p className={styles.statusText}>{issue.isOpen ? "Open" : "Closed"}</p>
            </div>
            <div>
              <a href='#' style={{fontStyle: 'italic'}} onClick={() => setModalOpen(true)}>Submit an article.</a>
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
      </>
    );
}

export default IssuePanel;