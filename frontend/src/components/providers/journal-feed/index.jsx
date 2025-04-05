import { createContext, useContext, useEffect, useState } from "react";
import { useSmartContract } from "@/hooks/useSmartContract";
import { useWallet } from "@/hooks/useWallet";

const JournalFeedContext = createContext(null);


export function JournalFeedProvider({ children }) {
    const [ issues, setIssues ] = useState([]);
    const { contractsData, getSmartContract, getSmartContractFromAddress } = useSmartContract();
    const { walletConnectionStatus } = useWallet();

    useEffect(() => {
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
            }
            ));

            console.log("Fetched issues:", issues);
            setIssues(issues);
        }
        if (walletConnectionStatus) {
            fetchIssues();
        }
    }
    , [walletConnectionStatus, contractsData]);



    return (
        <JournalFeedContext.Provider value={{ issues }}>
            {children}
        </JournalFeedContext.Provider>
    );
};

export function useJournalFeed() {
    const context = useContext(JournalFeedContext);
    if (!context) {
        throw new Error("useJournalFeed must be used within a JournalFeedProvider");
    }
    return context; 
}