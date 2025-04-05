// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./JournalIssue.sol";


contract JournalCore {
    address public owner;
    IERC20 public jcrToken;
    uint256 public issueStakeRequired;

    JournalIssue[] public issues;

    event IssueOpened(uint256 indexed issueId, address issueAddress);

    constructor(address _jcrToken, uint256 _issueStakeRequired) {
        owner = msg.sender;
        jcrToken = IERC20(_jcrToken);
        issueStakeRequired = _issueStakeRequired;
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
        JournalIssue issue = new JournalIssue(
            issues.length,
            issueName,
            descriptionIpfsHash,
            descriptionContentHash,
            address(jcrToken),
            durationDays,
            articleStakeRequired
        );

        issues.push(issue);
        emit IssueOpened(issues.length - 1, address(issue));
    }

    function getIssueCount() external view returns (uint256) {
        return issues.length;
    }

    function getIssue(uint256 index) external view returns (address) {
        require(index < issues.length, "Invalid issue index");
        return address(issues[index]);
    }
}
