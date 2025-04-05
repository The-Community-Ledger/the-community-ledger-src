import IssuePanel from "@/components/common/issue-panel";
import { useJournalContent } from "@/hooks/useJournalContent";
import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";


function FeedPanel() {
    const { fetchIssues } = useJournalContent()
    const [ issues, setIssues ] = useState([]);
    const { walletConnectionStatus } = useWallet();

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
        <div>
            {issues.length == 0 && <p>No issues to display.</p>}
            {issues.map((issue, i) => <IssuePanel key={i} issue={issue} />)}
        </div>
    );
}

export default FeedPanel;