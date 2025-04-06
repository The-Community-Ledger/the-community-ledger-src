// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IJournalIssueFactory } from "./JournalIssueFactory.sol";
import { IJCRMinter} from "./JournalCredit.sol";
import {console}  from "hardhat/console.sol";

interface IJournalIssue {
    function submitArticle(string calldata _ipfsHash, bytes32 _contentHash) external;
    function getIssueDetails() external view returns (uint256, address, string memory, bytes32, uint256);
    function getIssueId() external view returns (uint256);
    function getArticleStakeRequired() external view returns (uint256);
    function getReviewerStakeRequired() external view returns (uint256);
    function getOwner() external view returns (address);
}

contract JournalCore {
    address public owner;
    IERC20 public jcrToken;
    uint256 public issueStakeRequired;
    IJournalIssueFactory public issueFactory;

    IJournalIssue[] public issues;
    mapping(address => bool) public isKnownIssue;
    mapping(address => bool) public isRewarded;

    event IssueOpened(uint256 indexed issueId, address issueAddress);

    constructor(address _jcrToken, uint256 _issueStakeRequired, address _issueFactory) {
        owner = msg.sender;
        jcrToken = IERC20(_jcrToken);
        issueStakeRequired = _issueStakeRequired;
        issueFactory = IJournalIssueFactory(_issueFactory);
    }

    function createIssue(    
        string calldata issueName,
        string calldata descriptionIpfsHash, 
        bytes32 descriptionContentHash, 
        uint256 durationDays,
        uint256 articleStakeRequired,
        uint256 reviewStakeRequired
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
            articleStakeRequired, 
            reviewStakeRequired, 
            msg.sender
        );

        issues.push(IJournalIssue(issueAddress));
        isKnownIssue[issueAddress] = true;
        emit IssueOpened(issues.length - 1,issueAddress);
    }

    function rewardForIssue(
            address[] calldata authors,
            address[] calldata reviewers
        ) external {
        console.log("Rewarding for issue:", msg.sender); // Log the issue address
        require(isKnownIssue[msg.sender], "Unknown issue");
        require(!isRewarded[msg.sender], "Already rewarded");

        // filter out the owner and 0x0 from authors and reviewers
        address[] memory filteredAuthors = new address[](authors.length);
        address[] memory filteredReviewers = new address[](reviewers.length);
        uint256 authorCount = 0;
        uint256 reviewerCount = 0;
        for (uint256 i = 0; i < authors.length; i++) {
            if (authors[i] != msg.sender && authors[i] != address(0)) {
                filteredAuthors[authorCount] = authors[i];
                authorCount++;
            }
        }
        for (uint256 i = 0; i < reviewers.length; i++) {
            if (reviewers[i] != msg.sender && reviewers[i] != address(0)) {
                filteredReviewers[reviewerCount] = reviewers[i];
                reviewerCount++;
            }
        }
        console.log('Computing rewards'); // Log the reward computation
        IJournalIssue issue = IJournalIssue(msg.sender);
        uint256 mintFactor = 1000 + 500 * (authorCount + reviewerCount - 1) / (authorCount + reviewerCount);
        uint256 ownersReward = issueStakeRequired * mintFactor / 1000;
        uint256 authorsReward = issue.getArticleStakeRequired() * mintFactor / 1000;
        uint256 reviewersReward = issue.getReviewerStakeRequired() * mintFactor / 1000;
        uint256 jcrToMint = ownersReward - issueStakeRequired + (authorsReward - issue.getArticleStakeRequired()) * authorCount + (reviewersReward - issue.getReviewerStakeRequired()) * reviewerCount;

        console.log('Minting rewards'); // Log the reward minting
        IJCRMinter jcrTokenMinter = IJCRMinter(address(jcrToken));
        jcrTokenMinter.mint(address(this), jcrToMint);

        console.log('Transferring rewards'); // Log the reward transfer
        jcrToken.approve(address(issue.getOwner()), ownersReward);
        jcrToken.transfer(issue.getOwner(), ownersReward);

        console.log('Transferring rewards to filtered authors and reviewers'); // Log the reward transfer to filtered authors and reviewers
        for (uint256 i = 0; i < authorCount; i++) {
            console.log('Transferring rewards to author:', filteredAuthors[i]); // Log the author address
            jcrToken.approve(filteredAuthors[i], authorsReward);
            jcrToken.transfer(filteredAuthors[i], authorsReward);
        }
        for (uint256 i = 0; i < reviewerCount; i++) {
            console.log('Transferring rewards to reviewer:', filteredReviewers[i]); // Log the reviewer address
            jcrToken.approve(filteredReviewers[i], reviewersReward);
            jcrToken.transfer(filteredReviewers[i], reviewersReward);
        }
        isRewarded[msg.sender] = true;
    }



    function getIssueStakeRequired() external view returns (uint256) {
        return issueStakeRequired;
    }

    function getIssues() external view returns (address[] memory) {
        address[] memory issueAddresses = new address[](issues.length);
        for (uint256 i = 0; i < issues.length; i++) {
            issueAddresses[i] = address(issues[i]);
        }
        return issueAddresses;
    }



    function getIssue(uint256 issueId) external view returns (address) {
        require(issueId < issues.length, "Invalid issue ID");
        return address(issues[issueId]);
    }

}
