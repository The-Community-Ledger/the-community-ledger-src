// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

// Importing the IERC20 interface from OpenZeppelin for ERC20 token interactions
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { Article } from "./Article.sol";

// Contract for managing a journal issue
contract JournalIssue {
    // State variables
    uint256 public issueId; // Unique ID of the journal issue
    IERC20 public jcrToken; // ERC20 token used for staking
    address public issueOwner; // Owner of the journal issue
    uint256 public issueOpenTime; // Timestamp when the issue was opened
    uint256 public issueCloseTime; // Timestamp when the issue will close
    uint256 public articleStakeRequired; // Minimum stake required to submit an article
    uint256 public nextArticleId; // Counter for the next article ID
    string public issueName; // Name of the journal issue
    string public descriptionIpfsHash; // IPFS hash of the issue description
    bytes32 public descriptionContentHash; // Hash of the issue description content

    Article[] public articles; // Array to store submitted articles

    // Event emitted when an article is submitted
    event ArticleSubmitted(uint256 indexed articleId, string ipfsHash, address articleAdress);

    // Constructor to initialize the journal issue
    constructor(
        uint256 _issueId,
        string memory _issueName,
        string memory _descriptionIpfsHash, 
        bytes32 _descriptionContentHash, 
        address _jcrToken,
        uint256 _durationDays,
        uint256 _articleStakeRequired
    ) {
        jcrToken = IERC20(_jcrToken); // Set the ERC20 token
        issueId = _issueId; // Set the issue ID
        issueOwner = msg.sender; // Set the owner of the issue
        issueOpenTime = block.timestamp; // Set the opening time
        issueCloseTime = block.timestamp + (_durationDays * 1 days); // Set the closing time
        articleStakeRequired = _articleStakeRequired; // Set the required stake
        issueName = _issueName; // Set the issue name
        descriptionIpfsHash = _descriptionIpfsHash; // Set the description IPFS hash
        descriptionContentHash = _descriptionContentHash; // Set the description content hash
    }

    // Function to submit an article to the journal
    function submitArticle(string calldata _ipfsHash, bytes32 _contentHash) external {
        require(block.timestamp < issueCloseTime, "Issue is closed"); // Ensure the issue is open
        require(jcrToken.balanceOf(msg.sender) >= articleStakeRequired, "Insufficient JCR balance"); // Check token balance
        require(jcrToken.allowance(msg.sender, address(this)) >= articleStakeRequired, "JCR allowance not set"); // Check token allowance

        jcrToken.transferFrom(msg.sender, address(this), articleStakeRequired); // Transfer tokens for staking

        nextArticleId++; // Increment the article ID counter

        // Add the article to the list
        Article article = new Article(
            nextArticleId,
            msg.sender,
            _ipfsHash,
            _contentHash,
            articleStakeRequired,
            address(this) // Pass the address of the parent issue
        );
        articles.push(article); // Store the article in the array

        emit ArticleSubmitted(nextArticleId, _ipfsHash, address(article)); // Emit the submission event
    }

    // Function to check if the issue is still open
    function isOpen() external view returns (bool) {
        return block.timestamp < issueCloseTime;
    }

    // Function to get all submitted articles
    function getArticles() external view returns (Article[] memory) {
        return articles;
    }

    // Function to get details of a specific article by ID
    function getArticle(uint256 _articleId) external view returns (Article) {
        require(_articleId < nextArticleId, "Invalid article ID"); // Ensure the article ID is valid
        return articles[_articleId];
    }

    // Function to get details of the journal issue
    function getIssueDetails() external view returns (
        string memory,
        string memory,
        bytes32,
        address,
        uint256,
        uint256,
        uint256
    ) {
        return (
            issueName,
            descriptionIpfsHash,
            descriptionContentHash,
            issueOwner,
            issueOpenTime,
            issueCloseTime,
            articleStakeRequired
        );
    }

    function getIssueName() external view returns (string memory) {
        return issueName;
    }
    function getDescriptionIpfsHash() external view returns (string memory) {
        return descriptionIpfsHash;
    }
    function getDescriptionContentHash() external view returns (bytes32) {
        return descriptionContentHash;
    }
    function getIssueOwner() external view returns (address) {
        return issueOwner;
    }
    function getIssueOpenTime() external view returns (uint256) {
        return issueOpenTime;
    }
    function getIssueCloseTime() external view returns (uint256) {
        return issueCloseTime;
    }
    function getArticleStakeRequired() external view returns (uint256) {
        return articleStakeRequired;
    }
    function getArticleCount() external view returns (uint256) {
        return articles.length;
    }
}
