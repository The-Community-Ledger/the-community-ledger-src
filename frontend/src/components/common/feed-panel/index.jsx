import IssuePanel from "@/components/common/issue-panel";
import { useJournalContent } from "@/hooks/useJournalContent";
import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";


function FeedPanel() {
    const { fetchIssues } = useJournalContent()
    const [ issues, setIssues ] = useState([]);
    const { walletConnectionStatus } = useWallet();
    const { contractData } = useWallet();

    useEffect(() => {
        const _fetchIssues = async () => {
            const issues = await fetchIssues();
            if (!issues) return;
            console.log("Fetched issues:", issues);
            setIssues(issues);
        }
        if (walletConnectionStatus) {
            _fetchIssues();
        }
    }
    , [walletConnectionStatus]);

    return ( 
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "space-around"}}>
            <h2 style={{paddingLeft: "2rem", fontFamily: "Gloock", }} >Issues:</h2>
            {issues.length == 0 && <p>No issues to display.</p>}
            {issues.map((issue, i) => <IssuePanel key={i} issue={issue} />)}
        </div>
    );
}

export default FeedPanel;