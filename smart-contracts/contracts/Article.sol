// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import './Review.sol';

contract Article {
    uint256 public id; // Unique ID of the article
    address public submitter; // Address of the author
    string public ipfsHash; // IPFS hash of the article
    bytes32 public contentHash; // Hash of the article content for verification
    uint256 public stakeAmount; // Amount of JCR tokens staked for the article
    address public parentIssue; // Address of the parent issue

    // Constructor to initialize the article
    constructor(
        uint256 _id,
        address _submitter,
        string memory _ipfsHash,
        bytes32 _contentHash,
        uint256 _stakeAmount, 
        address _parentIssue
    ) {
        id = _id; // Set the article ID
        submitter = _submitter; // Set the submitter's address
        ipfsHash = _ipfsHash; // Set the IPFS hash
        contentHash = _contentHash; // Set the content hash
        stakeAmount = _stakeAmount; // Set the stake amount
        parentIssue = _parentIssue; // Set the parent issue address
    }

    // Function to submit a review for the article
    function submitReview(string calldata _ipfsHash, bytes32 _contentHash) external {
        require(parentIssue.isOpen(), "Issue is closed"); // Ensure the parent issue is open
        Review review = new Review(
            id,
            msg.sender,
            _ipfsHash,
            _contentHash,
            stakeAmount, 
            address(this)
        ); // Create a new review instance
        emit ReviewSubmitted(id, _ipfsHash, address(review)); // Emit an event for the review submission
    }

    // Function to get the article details
    function getArticleDetails() external view returns (uint256, address, string memory, bytes32, uint256) {
        return (id, submitter, ipfsHash, contentHash, stakeAmount); // Return the article details
    }
    // Function to get the article ID
    function getArticleId() external view returns (uint256) {
        return id; // Return the article ID
    }
    // Function to get the article submitter
    function getArticleSubmitter() external view returns (address) {
        return submitter; // Return the submitter's address
    }          
    // Function to get the article IPFS hash
    function getArticleIpfsHash() external view returns (string memory) {
        return ipfsHash; // Return the IPFS hash
    }
    // Function to get the article content hash
    function getArticleContentHash() external view returns (bytes32) {
        return contentHash; // Return the content hash
    }
    // Function to get the article stake amount
    function getArticleStakeAmount() external view returns (uint256) {
        return stakeAmount; // Return the stake amount
    }
}