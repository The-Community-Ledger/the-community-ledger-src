import { useEffect, useState } from "react";
import { useIpfsStore } from "@/hooks/useIpfsStore";
import { useWallet } from "@/hooks/useWallet";
import { ethers } from "ethers";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

import MarkdownModal from "../markdown-modal";
import { useJournalContent } from "@/hooks/useJournalContent";


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

const activeButtonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: 'green',
};

const inactiveButtonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    border: 'none',
    cursor: 'not-allowed',
    color: '#fff',
    backgroundColor: '#ccc',
};


// Resolves an article from its CID, check the content, display
function ArticleCard({ article }) {
    const { fetchIpfsData, storeIpfsData } = useIpfsStore();
    const { fetchReviewsForArticle } = useJournalContent();
    const [ content, setContent ] = useState("");
    const [ error, setError ] = useState(null);
    const { walletConnectionStatus } = useWallet();
    const [ modalOpen, setModalOpen ] = useState(false);    
    const [ submitError, setSubmitError ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ reviewCount, setReviewCount ] = useState(0);
    const [ hasReviewed, setHasReviewed ] = useState(false);
    const [ isFetching, setIsFetching ] = useState(false);
    const [ isStoring, setIsStoring ] = useState(false);
    const [ reviews, setReviews ] = useState([]);


    // Update states from contract
    useEffect(() => {
        const fetchReviewStatus = async () => {
            setIsFetching(true);
            const count = await article.contract.getReviewCount();
            const hasReviewed = await article.contract.hasReviewedSender();
            console.log("Fetched review status:", { hasReviewed, count });
            const reviews = await fetchReviewsForArticle(article);
            console.log("Fetched reviews:", reviews);
            setReviews(reviews);
            setHasReviewed(hasReviewed);
            setReviewCount(count);
            setIsFetching(false);
        }
        if (walletConnectionStatus === "connected" && article) {
            fetchReviewStatus();
        }
    }, [walletConnectionStatus]);

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

    // Handle markdown submit
    const handleSubmit = async (md) => {
        if (!md) {
            setSubmitError("Empty content.");
            return;
        }
        console.log("Submitting markdown:", md);
        setIsLoading(true);
        setSubmitError("");
        let cid; 
        try {
            cid = await storeIpfsData({ content: md });
            if (!cid) {
                setSubmitError("Error storing IPFS data.");
                return;
            }
            const data = await fetchIpfsData(cid);
            if (!data) {
                setSubmitError("Error fetching IPFS data.");
                return;
            }
            console.log("Stored IPFS data with CID:", cid);
            } catch (error) {
            console.error("Error storing IPFS data:", error);
            setSubmitError("Error storing IPFS data.");
            setIsLoading(false);
            return;
        }
        try {// Store data on chain

            // Step 1: Convert JSON to string
            const jsonString = JSON.stringify(md);
            
            // Step 2: Hash it with keccak256 to get bytes32
            const contentHash = ethers.keccak256(ethers.toUtf8Bytes(jsonString));
            
            // Step 3: Call the submitArticle function
            console.log("Submitting article to contract:", article.contract);
            const submitTx = await article.contract.submitReview(cid, contentHash);
            console.log("Transaction submitted:", submitTx);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting article:", error);
            setSubmitError("Error submitting article.");
        }   
        setIsLoading(false);
    }



    return ( 
        <>
            <MarkdownModal
                isOpen={modalOpen}
                isSubmitted={isSubmitted}
                isLoading={isLoading}
                error={submitError}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                title={"Submit an review"}
                initialValue=""
            />

            <div style={{ padding: "2rem", paddingTop: '1rem', minWidth: "400px", height: "550px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", fontSize: '60%', overflow: 'scroll', 
                display: 'flex', flexDirection: 'column', gap: "2rem"
            }}>
                <div style={{ borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
                    { content && <MDEditor.Markdown source={ content } previewOptions={{rehypePlugins: [[rehypeSanitize]],}}/> }
                    { isLoading && <p>Loading...</p> }
                    { error && <p>Error: {error.message}</p> }
                </div>
                {(isLoading || isFetching || hasReviewed) && <button style={inactiveButtonStyle} disabled={true}>Reviewed</button>}
                {!(isLoading || isFetching || hasReviewed) && 
                    <button style={activeButtonStyle} onClick={() => setModalOpen(true)}>Review</button>
                }
            </div>
        </>
     );
}

export default ArticleCard;