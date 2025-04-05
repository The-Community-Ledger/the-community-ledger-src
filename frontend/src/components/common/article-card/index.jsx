import { useEffect, useState } from "react";
import { useIpfsStore } from "@/hooks/useIpfsStore";
import { useWallet } from "@/hooks/useWallet";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";


const sampleArticle = {
    content: `# The Wonders of Photosynthesis

Photosynthesis is a process used by plants, algae, and certain bacteria to convert light energy into chemical energy stored in glucose. This process is vital for life on Earth as it provides the primary energy source for all living organisms.

## The Process

Photosynthesis occurs in two main stages:
1. **Light-dependent Reactions**: These take place in the thylakoid membranes of chloroplasts where sunlight is absorbed by chlorophyll, generating ATP and NADPH.
2. **Calvin Cycle**: This occurs in the stroma of chloroplasts, where ATP and NADPH are used to convert carbon dioxide into glucose.

## Importance

- Produces oxygen as a byproduct, essential for aerobic organisms.
- Forms the base of the food chain, supporting ecosystems globally.

Understanding photosynthesis helps us address challenges like food security and climate change.

*“Photosynthesis is not just a process; it is the foundation of life.”*`
};


// Resolves an article from its CID, check the content, display
function ArticleCard({ article }) {
    const { fetchIpfsData } = useIpfsStore();
    const [ content, setContent ] = useState("");
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const { walletConnectionStatus } = useWallet();

    useEffect(() => {
        const _fetchIpfsData = async () => {
            setIsLoading(true);
            try {
                console.log("Fetching IPFS data for article:", article);
                let data; 
                if ( article.ipfsHash.startsWith("QmSample") ) {
                    data = sampleArticle;   
                } else {
                    data = await fetchIpfsData(article.ipfsHash);
                }
                if (!data) throw new Error("Error fetching data");
                setContent(data.content);
                return data;
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        }
        if (walletConnectionStatus === "connected" && article) {
            _fetchIpfsData();
        }
    }
    , [article, walletConnectionStatus]);

    return ( 
        <div style={{ padding: "2rem", paddingTop: '1rem', minWidth: "400px", height: "550px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", fontSize: '60%', overflow: 'scroll'}}>
            { content && <MDEditor.Markdown source={ content } previewOptions={{rehypePlugins: [[rehypeSanitize]],}}/> }
            { isLoading && <p>Loading...</p> }
            { error && <p>Error: {error.message}</p> }
        </div>
     );
}

export default ArticleCard;