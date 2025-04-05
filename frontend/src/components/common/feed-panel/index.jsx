import { useJournalFeed } from "@/components/providers/journal-feed";


function FeedPanel() {
    const [ issues ] = useJournalFeed()

    return ( 
        <div>
            {!issues && <p>No issues to display.</p>}
            {issues && issues.map((issue) => <IssuePannel issue={issue} />)}
        </div>
    );
}

export default FeedPanel;