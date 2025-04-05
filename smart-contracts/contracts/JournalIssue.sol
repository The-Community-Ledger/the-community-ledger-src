// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract JournalIssue {
    struct Article {
        uint256 id;
        address submitter; // Address of the author
        string ipfsHash; // IPFS hash of the article
        bytes32 contentHash; // Hash of the article content (in case of unpin on IPFS)
        uint256 stakeAmount; // Amount of JCR staked 
    }

    IERC20 public jcrToken;
    address public issueOwner;
    uint256 public issueOpenTime;
    uint256 public issueCloseTime;
    uint256 public articleStakeRequired;
    uint256 public nextArticleId;
    string public issueName;
    string public descriptionIpfsHash;
    bytes32 public descriptionContentHash;

    Article[] public articles;

    event ArticleSubmitted(uint256 indexed articleId, string ipfsHash, address submitter);

    constructor(
        string memory _issueName,
        string memory _descriptionIpfsHash, 
        bytes32 _descriptionContentHash, 
        address _jcrToken,
        uint256 _durationDays,
        uint256 _articleStakeRequired
    ) {
        jcrToken = IERC20(_jcrToken);
        issueOwner = msg.sender;
        issueOpenTime = block.timestamp;
        issueCloseTime = block.timestamp + (_durationDays * 1 days);
        articleStakeRequired = _articleStakeRequired;
        issueName = _issueName;
        descriptionIpfsHash = _descriptionIpfsHash;
        descriptionContentHash = _descriptionContentHash;
    }

    function submitArticle(string calldata _ipfsHash, bytes32 _contentHash) external {
        require(block.timestamp < issueCloseTime, "Issue is closed");
        require(jcrToken.balanceOf(msg.sender) >= articleStakeRequired, "Insufficient JCR balance");
        require(jcrToken.allowance(msg.sender, address(this)) >= articleStakeRequired, "JCR allowance not set");

        jcrToken.transferFrom(msg.sender, address(this), articleStakeRequired);

        nextArticleId++;

        articles.push(Article({
            id: nextArticleId,
            submitter: msg.sender,
            ipfsHash: _ipfsHash,
            contentHash: _contentHash,
            stakeAmount: articleStakeRequired
        }));

        emit ArticleSubmitted(nextArticleId, _ipfsHash, msg.sender);
    }

    function isOpen() external view returns (bool) {
        return block.timestamp < issueCloseTime;
    }

    function getArticles() external view returns (Article[] memory) {
        return articles;
    }

    function getArticle(uint256 _articleId) external view returns (Article memory) {
        require(_articleId < nextArticleId, "Invalid article ID");
        return articles[_articleId];
    }

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
