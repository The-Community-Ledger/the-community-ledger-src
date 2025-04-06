import { useEffect, useState } from "react";
import { useJournalContent } from "@/hooks/useJournalContent";
import ArticleCard from "../article-card";
import { useWallet } from "@/hooks/useWallet";
import styles from "./style.module.css";
import { useIpfsStore } from "@/hooks/useIpfsStore";
import MarkdownModal from "../markdown-modal";
import { ethers } from "ethers";


// Checks issue, display its content as articles
function IssuePanel({ issue }) {
    const [ articles, setArticles ] = useState([]);
    const { fetchArticlesForIssue } = useJournalContent();
    const { walletConnectionStatus, walletAddress } = useWallet();
    const { fetchIpfsData, storeIpfsData } = useIpfsStore();
    const [ modalOpen, setModalOpen ] = useState(false);    
    const [ submitError, setSubmitError ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ isOwner, setIsOwner ] = useState(false);
    const [ isIssueOpen, setIsIssueOpen ] = useState(false);

    // Is the issue open?
    useEffect(() => {
        const checkIssueStatus = async () => {
            if (walletConnectionStatus === "connected" && issue) {
                const isOpen = await issue.contract.isOpen();
                console.log("Checking issue status:", { issue, isOpen });
                setIsIssueOpen(isOpen);
            }
        }
        checkIssueStatus();
    }, [issue, walletConnectionStatus]);

    // Fetch articles for the issue
    useEffect(() => {
        const _fetchArticles = async () => {
            const articles = await fetchArticlesForIssue(issue);
            console.log("Fetched articles:", articles);
            if (!articles) return;
            setArticles(articles);
        }
        if (walletConnectionStatus === "connected" && issue) {
            _fetchArticles();
        }
    }, [issue, walletConnectionStatus]);

    // Check if the user is the owner of the issue
    useEffect(() => {
        const checkOwner = async () => {
            if (walletConnectionStatus === "connected" && issue) {
                const isOwner = await issue.contract.owner() === walletAddress;
                console.log("Checking owner status:", { owner: issue.owner, walletAddress, isOwner });
                setIsOwner(isOwner);
            }
        }
        checkOwner();
    }, [issue, walletConnectionStatus]);


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
            console.log("Submitting article to contract:", issue.contract);
            const submitTx = await issue.contract.submitArticle(cid, contentHash);
            console.log("Transaction submitted:", submitTx);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting article:", error);
            setSubmitError("Error submitting article.");
        }   
       setIsLoading(false);
    }

    const handleCloseIssue = async () => {
        try {
            const closeTx = await issue.contract.closeIssue();
            console.log("Transaction submitted:", closeTx);
        } catch (error) {
            console.error("Error closing issue:", error);
            setSubmitError("Error closing issue.");
        }   
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
          title={"Submit an article to " + issue.name }
          initialValue=""
         />

        <div className={styles.container}>
          <div className={styles.header} > 
            <h3 className={styles.title}><it style={{fontStyle: 'italics', fontSize: '0.9rem'}}>Issue:</it> {issue.name}.</h3>
            <div className={styles.statusBadge} style={{backgroundColor: isIssueOpen ? 'green' : 'red' }}>
              <p className={styles.statusText}>{isIssueOpen ? "Open" : "Closed"}</p>
            </div>
            <div>
              { !isSubmitted && <a href='#' style={{fontStyle: 'italic'}} onClick={() => setModalOpen(true)}>Submit an article.</a> }
              { isSubmitted && <p style={{fontStyle: 'italic'}}>Article submitted.</p> }
            </div>
            <div>
              {isOwner && <p style={{marginLeft:'500px', fontStyle: 'italic'}}>You are the owner of this issue. {isIssueOpen ? <a href='#' onClick={handleCloseIssue}>Close it.</a> : <></>}</p>}
            </div>
          </div>
    
          <div className={styles.articlesRow}>
            {articles.length === 0 && <p>No articles yet.</p>}
            {articles.map((article, i) => (
              <div key={i}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
}

export default IssuePanel;