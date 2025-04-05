// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { JournalIssue } from "./JournalIssue.sol";

contract JournalIssueFactory {
    address public jcrToken;
    address public articleFactory;

    constructor(address _jcrToken, address _articleFactory) {
        jcrToken = _jcrToken;
        articleFactory = _articleFactory;
    }

    function createIssue(
            uint256 issueId,
            string calldata issueName,
            string calldata descriptionIpfsHash, 
            bytes32 descriptionContentHash, 
            uint256 durationDays,
            uint256 articleStakeRequired
        ) external returns (address) {
        JournalIssue issue = new JournalIssue(
            issueId,
            issueName,
            descriptionIpfsHash,
            descriptionContentHash,
            jcrToken,
            durationDays,
            articleStakeRequired,
            articleFactory
        );
        return address(issue);
    }
}

interface IJournalIssueFactory {
    function createIssue(
        uint256 issueId,
        string calldata issueName,
        string calldata descriptionIpfsHash, 
        bytes32 descriptionContentHash, 
        uint256 durationDays,
        uint256 articleStakeRequired
    ) external returns (address);
}
