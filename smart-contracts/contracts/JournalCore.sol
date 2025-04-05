// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IJournalIssueFactory } from "./JournalIssueFactory.sol";

interface IJournalIssue {
    function submitArticle(string calldata _ipfsHash, bytes32 _contentHash) external;
    function getIssueDetails() external view returns (uint256, address, string memory, bytes32, uint256);
    function getIssueId() external view returns (uint256);
}

contract JournalCore {
    address public owner;
    IERC20 public jcrToken;
    uint256 public issueStakeRequired;
    IJournalIssueFactory public issueFactory;

    IJournalIssue[] public issues;

    event IssueOpened(uint256 indexed issueId, address issueAddress);

    constructor(address _jcrToken, uint256 _issueStakeRequired, address _issueFactory) {
        owner = msg.sender;
        jcrToken = IERC20(_jcrToken);
        issueStakeRequired = _issueStakeRequired;
        issueFactory = IJournalIssueFactory(_issueFactory);
    }

    function openIssue(    
        string calldata issueName,
        string calldata descriptionIpfsHash, 
        bytes32 descriptionContentHash, 
        uint256 durationDays,
        uint256 articleStakeRequired
    ) external {
        require(jcrToken.balanceOf(msg.sender) >= issueStakeRequired, "Insufficient JCR balance"); // Check token balance
        require(jcrToken.allowance(msg.sender, address(this)) >= issueStakeRequired, "JCR allowance not set"); // Check token allowance

        jcrToken.transferFrom(msg.sender, address(this), issueStakeRequired); // Transfer tokens for staking

        // Deploy new Issue contract
        address issueAddress = issueFactory.createIssue(
            issues.length,
            issueName,
            descriptionIpfsHash,
            descriptionContentHash,
            durationDays,
            articleStakeRequired
        );

        issues.push(IJournalIssue(issueAddress));
        emit IssueOpened(issues.length - 1,issueAddress);
    }

    function getIssueCount() external view returns (uint256) {
        return issues.length;
    }

    function getIssue(uint256 index) external view returns (address) {
        require(index < issues.length, "Invalid issue index");
        return address(issues[index]);
    }

    function getIssues() external view returns (IJournalIssue[] memory) {
        return issues;
    }

    function getIssueStakeRequired() external view returns (uint256) {
        return issueStakeRequired;
    }
}
