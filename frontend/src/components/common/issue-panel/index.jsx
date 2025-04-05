import { useSmartContract } from "@/hooks/useSmartContract";
import { useEffect, useState } from "react";

// Checks issue, display its content as articles
function IssuePanel({ issue }) {
    const { getSmartConstractFromAddress } = useSmartContract();
    const { articles, setArticles } = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            const articlesAddresses = await issue.contract.getArticles();
            console.log("Fetched articles addresses:", articlesAddresses);
            const articles = await Promise.all(articlesAddresses.map(async (articleAddress) => {
                const articleContract = getSmartConstractFromAddress("ARTICLE", articleAddress);
                if (!articleContract) return null;
                console.log("Fetching article data from contract at address:", articleAddress);
                const articleData = await articleContract.getArticleDetails();
                console.log("Fetched article data:", articleData);
                return {
                    address: articleAddress,
                    contract: articleContract,
                    id: articleData[0],
                    owner: articleData[1],
                    name: articleData[2],
                    descriptionIpfsHash: articleData[3],
                    contentHash: articleData[4]
                };
            }));
            console.log("Fetched articles:", articles);
            setArticles(articles);
        }
        if (issue) {
            fetchArticles();
        }
    }
    , [issue]);

    return ( <><p>{ issue.name }</p></> );
}

export default IssuePanel;