import { useEffect, useState } from "react";
import { useIpfsStore } from "@/hooks/useIpfsStore";
import { useWallet } from "@/hooks/useWallet";

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
                    data = { content: "Sample content" };   
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
        <div style={{ padding: "1rem", minWidth: "450px", height: "450px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", }}>
            { content && <p>{ content }</p> }
            { isLoading && <p>Loading...</p> }
            { error && <p>Error: {error.message}</p> }
        </div>
     );
}

export default ArticleCard;