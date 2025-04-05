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
        <div>
            <h2>Issue: {issue.name}</h2>
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem", overflow: "scroll", height: "500px" }}>
                {articles.length == 0 && <p>No articles yet.</p>}
                {articles.map((article, i) => 
                    <ArticleCard key={i} article={article} />
                )}
            </div>
        </div>
     );
}

export default IssuePanel;