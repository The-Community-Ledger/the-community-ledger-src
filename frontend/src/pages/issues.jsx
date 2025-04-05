import Issues from "@/components/pages/issues";
import { JournalFeedProvider } from "@/components/providers/journal-feed";

function IssuesPage() {
    return ( 
        <JournalFeedProvider>
            <Issues />
        </JournalFeedProvider>
     );
}

export default IssuesPage;