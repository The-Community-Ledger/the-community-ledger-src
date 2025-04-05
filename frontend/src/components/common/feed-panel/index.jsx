import { useJournalFeed } from "@/components/providers/journal-feed";
import IssuePanel from "@/components/common/issue-panel";


function FeedPanel() {
    const { issues } = useJournalFeed()
    return ( 
        <div>
            {issues.length == 0 && <p>No issues to display.</p>}
            {issues.map((issue, i) => <IssuePanel key={i} issue={issue} />)}
        </div>
    );
}

export default FeedPanel;