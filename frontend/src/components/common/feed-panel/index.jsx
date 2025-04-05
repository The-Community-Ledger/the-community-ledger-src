import { useJournalFeed } from "@/components/providers/journal-feed";


function FeedPanel() {
    const { issues } = useJournalFeed()
    console.log('here', issues, issues.length)
    return ( 
        <div>
            {issues.length == 0 && <p>No issues to display.</p>}
            {issues.map((issue) => <IssuePannel issue={issue} />)}
        </div>
    );
}

export default FeedPanel;