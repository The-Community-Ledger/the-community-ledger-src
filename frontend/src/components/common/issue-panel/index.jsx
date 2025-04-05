import { useEffect, useState } from "react";
import { useJournalContent } from "@/hooks/useJournalContent";
import ArticleCard from "../article-card";
import { useWallet } from "@/hooks/useWallet";

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
        <div style={{
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            paddingBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              width: '80%',
              gap: '2rem',
              borderTop: '0.1px solid #ccc',
              paddingTop: '1rem'
            }}>
              <h3 style={{ fontFamily: "Gloock", fontSize: '1.4rem' }}>{issue.name}</h3>
              <div style={{
                backgroundColor: 'green',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '5px',
                height: '1.8rem',
                padding: '0 0.5rem'
              }}>
                <p style={{ color: 'white', fontSize: '0.8rem', margin: 0 }}>{issue.isOpen ? "Open" : "Closed"}</p>
              </div>
            </div>
          
            <div style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              overflowX: "auto",
              overflowY: 'hidden',
              padding: "1rem",
              width: "100%",
              paddingLeft: "1rem",
              maxHeight: "500px",
              alignItems: "center",
              boxSizing: "border-box",
            }}>
              {articles.length === 0 && <p>No articles yet.</p>}
              {articles.map((article, i) =>
                <div key={i}>
                  <ArticleCard article={article} />
                </div>
              )}
            </div>
          </div>
     );
}

export default IssuePanel;