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

    function isOpen() external view returns (bool) {
        return block.timestamp < issueCloseTime;
    }
}
