// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

interface IArticle {
    function getParentIssue() external view returns (IIssue);
}

interface IIssue {
    function isOpen() external view returns (bool);
}

contract Review {
    uint256 public id; // Unique ID of the review
    address public reviewer; // Address of the reviewer
    string public ipfsHash; // IPFS hash of the review
    bytes32 public contentHash; // Hash of the review content for verification
    uint256 public stakeAmount; // Amount of JCR tokens staked for the review
    IArticle public parentArticle; // Address of the parent article

    struct Challenge {
        address challenger; // Address of the challenger
        string ipfsHash; // IPFS hash of the challenge
        bytes32 contentHash; // Hash of the challenge content for verification
        uint256 stakeAmount; // Amount of JCR tokens staked for the challenge
    }
    Challenge public challenge; // Challenge struct to store challenge details
    bool public isChallenged; // Flag to indicate if the review is challenged

    // Event emitted when a challenge is submitted
    event ChallengeSubmitted(uint256 indexed reviewId, address indexed challenger, string ipfsHash, address reviewAddress);

    // Constructor to initialize the review
    constructor(
        uint256 _id,
        address _reviewer,
        string memory _ipfsHash,
        bytes32 _contentHash,
        uint256 _stakeAmount, 
        address _parentArticle
    ) {
        id = _id; // Set the review ID
        reviewer = _reviewer; // Set the reviewer's address
        ipfsHash = _ipfsHash; // Set the IPFS hash
        contentHash = _contentHash; // Set the content hash
        stakeAmount = _stakeAmount; // Set the stake amount
        parentArticle = IArticle(_parentArticle); // Set the parent article address
        challenge = Challenge(address(0), "", "", 0); // Initialize the challenge struct
        isChallenged = false; // Set the challenge flag to false
    }

    // Function to submit a challenge for the review
    function submitChallenge(
        address _challenger,
        string calldata _ipfsHash,
        bytes32 _contentHash,
        uint256 _stakeAmount
    ) external {
        require(!isChallenged, "Review is already challenged"); // Ensure the review is not already challenged
        require(parentArticle.getParentIssue().isOpen(), "Issue is closed"); // Ensure the parent issue is open

        challenge = Challenge(_challenger, _ipfsHash, _contentHash, _stakeAmount); // Set the challenge details
        isChallenged = true; // Set the challenge flag to true
        emit ChallengeSubmitted(id, _challenger, _ipfsHash, address(this)); // Emit an event for the challenge submission
    }
    
    // Function to get the parent article address
    function getParentArticle() external view returns (address) {
        return address(parentArticle); // Return the parent article address
    }

    function getReviewDetails() external view returns (uint256, address, string memory, bytes32, bool) {
        return (id, reviewer, ipfsHash, contentHash, isChallenged); // Return the review details
    }
    function getChallengeDetails() external view returns (address, string memory, bytes32) {
        require(isChallenged, "Review is not challenged"); // Ensure the review is challenged
        return (challenge.challenger, challenge.ipfsHash, challenge.contentHash); // Return the challenge details
    }

    function getReviewer() external view returns (address) {
        return reviewer; // Return the reviewer's address
    }


}