import { useSmartContract } from "./useSmartContract";


export function useJournalContent() {
    const { getSmartContract, getSmartContractFromAddress } = useSmartContract();

    const fetchIssues = async () => {
        const journalCoreContract = getSmartContract("JOURNALCORE");
        if (!journalCoreContract) return;
        console.log("Fetching issues from JournalCore contract...");
        const issuesAddresses = await journalCoreContract.getIssues();
        console.log("Fetched issues addresses:", issuesAddresses);
        const issues = await Promise.all(issuesAddresses.map(async (issueAddress) => {
            const issueContract = getSmartContractFromAddress("JOURNALISSUE", issueAddress);
            if (!issueContract) return null;
            console.log("Fetching issue data from contract at address:", issueAddress);
            const issueData = await issueContract.getIssueDetails();
            console.log("Fetched issue data:", issueData);
            return {
                address: issueAddress,
                contract: issueContract,
                id: issueData[0],
                owner: issueData[1],
                name: issueData[2],
                descriptionIpfsHash: issueData[3],
                articleStakeRequired: issueData[4]
            };
        }));
        console.log("Fetched issues:", issues);
        return issues;
    };

    const fetchArticlesForIssue = async (issue) => {
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
                submitter: articleData[1],
                ipfsHash: articleData[2],
                contentHash: articleData[3]
            };
        }));
        console.log("Fetched articles:", articles);
        return articles
    }

    const fetchReviewsForArticle = async (article) => {
        const reviewsAddresses = await article.contract.getReviews();
        console.log("Fetched reviews addresses:", reviewsAddresses);
        const reviews = await Promise.all(reviewsAddresses.map(async (reviewAddress) => {
            const reviewContract = getSmartConstractFromAddress("REVIEW", reviewAddress);
            if (!reviewContract) return null;
            console.log("Fetching review data from contract at address:", reviewAddress);
            const reviewData = await reviewContract.getReviewDetails();
            const isChallenged = reviewData[4];
            let challengeData = null;

            if (isChallenged) {
                const challengeData = await reviewContract.getChallengeDetails();
                console.log("Fetched challenge data:", challengeData);
            } 
            console.log("Fetched review data:", reviewData);
            return {
                address: reviewAddress,
                contract: reviewContract,
                id: reviewData[0],
                reviewer: reviewData[1],
                ipfsHash: articleData[2],
                contentHash: articleData[3],
                isChallenged: reviewData[4],
                challengeData: isChallenged ? {
                    challenger: challengeData[0],
                    challengeIpfsHash: challengeData[1],
                    challengeContentHash: challengeData[2]
                } : null
            };
        }));
        console.log("Fetched reviews:", reviews);
        return reviews;
    }

    return {
        fetchIssues,
        fetchArticlesForIssue,
        fetchReviewsForArticle
    };
}