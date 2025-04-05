// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Review, IIssue } from './Review.sol';
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Article {
    uint256 public id; // Unique ID of the article
    address public submitter; // Address of the author
    string public ipfsHash; // IPFS hash of the article
    bytes32 public contentHash; // Hash of the article content for verification
    uint256 public stakeAmount; // Amount of JCR tokens staked for the article
    IIssue public parentIssue; // Address of the parent issue
    IERC20 public jcrToken; // Address of the JCR token contract

    
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

    // Function to get the parent issue
    function getParentIssue() external view returns (address) {
        return address(parentIssue); // Return the parent issue address
    }

    // Function to get the article details
    function getArticleDetails() external view returns (uint256, address, string memory, bytes32) {
        return (id, submitter, ipfsHash, contentHash); // Return the article details
    }
}