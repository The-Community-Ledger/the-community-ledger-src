import { useEffect, useState } from "react";
import { useJournalContent } from "@/hooks/useJournalContent";

// Checks issue, display its content as articles
function IssuePanel({ issue }) {
    const [ articles, setArticles ] = useState([]);
    const { fetchArticlesForIssue } = useJournalContent();
    useEffect(() => {
        const fetchArticles = async () => {
            const articles = await fetchArticlesForIssue(issue);
            console.log("Fetched articles:", articles);
            setArticles(articles);
        }
        fetchArticles();
    }, [issue]);

    return ( <><p>{ issue.name }</p></> );
}

export default IssuePanel;