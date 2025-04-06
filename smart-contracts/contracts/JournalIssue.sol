// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

// Importing the IERC20 interface from OpenZeppelin for ERC20 token interactions
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IJCRMinter } from "./JournalCredit.sol"; // Importing the Journal Credit Minter interface
import { IArticleFactory } from "./ArticleFactory.sol";
import { console } from "hardhat/console.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol"; // Importing the Ownable contract for ownership management

interface IArticle {
    function getSubmitter() external view returns (address);
    function getReviews() external view returns (address[] memory);
}

interface IReview {
    function getReviewer() external view returns (address);
}

interface IJournalCore {
    function rewardFromIssue(address[] memory authors, address[] memory reviewers) external;
}

// Contract for managing a journal issue
contract JournalIssue is Ownable {
    // State variables
    uint256 public issueId; // Unique ID of the journal issue
    IERC20 public jcrToken; // ERC20 token used for staking
    address public issueOwner; // Owner of the journal issue
    uint256 public issueOpenTime; // Timestamp when the issue was opened
    uint256 public issueCloseTime; // Timestamp when the issue will close
    uint256 public articleStakeRequired; // Minimum stake required to submit an article
    uint256 public reviewStakeRequired; // Minimum stake required to review an article
    uint256 public nextArticleId; // Counter for the next article ID
    string public issueName; // Name of the journal issue
    string public descriptionIpfsHash; // IPFS hash of the issue description
    bytes32 public descriptionContentHash; // Hash of the issue description content
    IArticleFactory public articleFactory; // Address of the article factory
    bool public closed; // Flag to indicate if the issue is closed


    IArticle[] public articles; // Array to store submitted articles

    // Event emitted when an article is submitted
    event ArticleSubmitted(address articleAdress);
    // Event emitted when the issue is closed
    event IssueClosed(uint256 issueId);

    // Constructor to initialize the journal issue
    constructor(
        uint256 _issueId,
        string memory _issueName,
        string memory _descriptionIpfsHash, 
        bytes32 _descriptionContentHash, 
        address _jcrToken,
        uint256 _durationDays,
        uint256 _articleStakeRequired, 
        uint256 _reviewStakeRequired,
        address _articleFactory,
        address _owner
    ) Ownable(_owner) { 
        jcrToken = IERC20(_jcrToken); // Set the ERC20 token
        issueId = _issueId; // Set the issue ID
        issueOwner = _owner; // Set the owner of the issue
        issueOpenTime = block.timestamp; // Set the opening time
        issueCloseTime = block.timestamp + (_durationDays * 1 days); // Set the closing time
        articleStakeRequired = _articleStakeRequired; // Set the required stake
        reviewStakeRequired = _reviewStakeRequired; // Set the required review stake
        issueName = _issueName; // Set the issue name
        closed = false; // Set the issue as open
        descriptionIpfsHash = _descriptionIpfsHash; // Set the description IPFS hash
        descriptionContentHash = _descriptionContentHash; // Set the description content hash
        articleFactory = IArticleFactory(_articleFactory); // Set the article factory address
    }

    // Function to submit an article to the journal
    function submitArticle(string calldata _ipfsHash, bytes32 _contentHash) external {
        require(!closed, "Issue is closed"); // Ensure the issue is open
        require(jcrToken.balanceOf(msg.sender) >= articleStakeRequired, "Insufficient JCR balance"); // Check token balance
        require(jcrToken.allowance(msg.sender, address(this)) >= articleStakeRequired, "JCR allowance not set"); // Check token allowance

        jcrToken.transferFrom(msg.sender, IJCRMinter(address(jcrToken)).getMinter(), articleStakeRequired); // Transfer tokens for staking

        nextArticleId++; // Increment the article ID counter

        // Add the article to the list
        address articleAddress = articleFactory.createArticle(
            nextArticleId,
            msg.sender,
            _ipfsHash,
            _contentHash,
            reviewStakeRequired,
            address(this) // Pass the address of the parent issue
        );
        articles.push(IArticle(articleAddress)); // Store the article in the array
        console.log("Article submitted:", articleAddress); // Log the article submission
        emit ArticleSubmitted(articleAddress); // Emit the submission event
    }

    // Function to close the issue
    function closeIssue() external onlyOwner  {
        require(!closed, "Issue is already closed"); // Ensure the issue is not already closed
        closed = true; // Set the issue as closed

        // Collect address of authors and reviewers
        address[] memory authors = new address[](articles.length);
        address[] memory reviewers = new address[](articles.length);
        for (uint256 i = 0; i < articles.length; i++) {
            authors[i] = articles[i].getSubmitter(); // Get the submitter of each article
            address[] memory articleReviews = IArticle(address(articles[i])).getReviews(); // Get the reviewers of each article
            for (uint256 j = 0; j < articleReviews.length; j++) {
                reviewers[j] = IReview(articleReviews[j]).getReviewer(); // Store the reviewers
            }
        }

        address journalCore = IJCRMinter(address(jcrToken)).getMinter();
        IJournalCore(journalCore).rewardFromIssue(authors, reviewers); // Reward authors and reviewers

        emit IssueClosed(issueId); // Emit the issue closed event
    }

    // Function to check if the issue is still open
    function isOpen() external view returns (bool) {
        return !closed;
    }

    // Function to get the details of the issue
    function getIssueDetails() external view returns (uint256, address, string memory, string memory, uint256, uint256, uint256, bool) {
        return (issueId, issueOwner, issueName, descriptionIpfsHash, articleStakeRequired, issueOpenTime, issueCloseTime, block.timestamp < issueCloseTime);
    }

    // Function to get all articles submitted to the issue
    function getArticles() external view returns (address[] memory) {
        address[] memory articleAddresses = new address[](articles.length);
        for (uint256 i = 0; i < articles.length; i++) {
            articleAddresses[i] = address(articles[i]);
        }
        return articleAddresses;
    }

    function getArticleStakeRequired() external view returns (uint256) {
        return articleStakeRequired;
    }
    function getReviewerStakeRequired() external view returns (uint256) {
        return reviewStakeRequired;
    }

    function getOwner() external view returns (address) {
        return issueOwner;
    }
}
