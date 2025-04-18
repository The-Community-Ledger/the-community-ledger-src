// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Review, IIssue } from './Review.sol';
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IJCRMinter } from './JournalCredit.sol';

contract Article {
    uint256 public id; // Unique ID of the article
    address public submitter; // Address of the author
    string public ipfsHash; // IPFS hash of the article
    bytes32 public contentHash; // Hash of the article content for verification
    uint256 public stakeAmount; // Amount of JCR tokens staked for the article
    IIssue public parentIssue; // Address of the parent issue
    IERC20 public jcrToken; // Address of the JCR token contract
    uint256 public reviewStakeRequired; // Amount of JCR tokens required for review
    uint256 public reviewStakeAmount; // Amount of JCR tokens staked for the review

    Review[] public reviews; // Instance of the Review contract
    mapping(address => bool) public hasReviewed; // Mapping to track if an address has reviewed
    
    // Event emitted when a review is submitted
    event ReviewSubmitted(uint256 indexed articleId, string ipfsHash, address reviewAddress);

    // Constructor to initialize the article
    constructor(
        uint256 _id, 
        address _submitter,
        string memory _ipfsHash,
        bytes32 _contentHash,
        address _jcrToken,
        uint256 _stakeAmount, 
        address _parentIssue
    ) {
        id = _id; // Set the article ID
        submitter = _submitter; // Set the submitter's address
        ipfsHash = _ipfsHash; // Set the IPFS hash
        contentHash = _contentHash; // Set the content hash
        jcrToken = IERC20(_jcrToken); // Set the JCR token address
        stakeAmount = _stakeAmount; // Set the stake amount
        parentIssue = IIssue(_parentIssue); // Set the parent issue address
        reviewStakeAmount = 0; // Set the stake amount for the review
    }

    // Function to submit a review for the article
    function submitReview(string calldata _ipfsHash, bytes32 _contentHash) external {
        require(parentIssue.isOpen(), "Issue is closed"); // Ensure the parent issue is open
        require(!hasReviewed[msg.sender], "Already reviewed"); // Ensure the sender has not already reviewed
        require(jcrToken.balanceOf(msg.sender) >= stakeAmount, "Insufficient JCR balance"); // Check token balance
        require(jcrToken.allowance(msg.sender, address(this)) >= stakeAmount, "JCR allowance not set"); // Check token allowance

        jcrToken.transferFrom(msg.sender, IJCRMinter(address(jcrToken)).getMinter(), stakeAmount); // Transfer tokens for staking

        Review review = new Review(
            id,
            msg.sender,
            _ipfsHash,
            _contentHash,
            stakeAmount, 
            address(this)
        ); // Create a new review instance
        reviews.push(review); // Add the review to the list
        hasReviewed[msg.sender] = true; // Mark the submitter as having reviewed

        emit ReviewSubmitted(id, _ipfsHash, address(review)); // Emit an event for the review submission
    }

    // Function to get all reviews for the article
    function getReviews() external view returns (address[] memory) {
        address[] memory reviewAddresses = new address[](reviews.length); // Create an array to store review addresses
        for (uint256 i = 0; i < reviews.length; i++) {
            reviewAddresses[i] = address(reviews[i]); // Store each review's address
        }
        return reviewAddresses; // Return the array of review addresses
    }

    // Function to check if the sender has already reviewed
    function hasReviewedSender() external view returns (bool) {
        return hasReviewed[msg.sender]; // Return true if the sender has reviewed
    }

    // Function to get the article ID
    function getReviewCount() external view returns (uint256) {
        return reviews.length; // Return the number of reviews
    }

    // Function to get the parent issue
    function getParentIssue() external view returns (address) {
        return address(parentIssue); // Return the parent issue address
    }

    // Function to get the submitter's address
    function getSubmitter() external view returns (address) {
        return submitter; // Return the submitter's address
    }

    // Function to get the article details
    function getArticleDetails() external view returns (uint256, address, string memory, bytes32) {
        return (id, submitter, ipfsHash, contentHash); // Return the article details
    }
}