// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Article } from './Article.sol';

interface IArticleFactory {
    function createArticle(
        uint256 id,
        address submitter,
        string calldata ipfsHash,
        bytes32 contentHash,
        uint256 stakeAmount,
        address parentIssue
    ) external returns (address);
}

contract ArticleFactory {
    address public jcrToken;

    constructor(address _jcrToken) {
        jcrToken = _jcrToken;
    }

    function createArticle(
        uint256 id,
        address submitter,
        string calldata ipfsHash,
        bytes32 contentHash,
        uint256 stakeAmount,
        address parentIssue
    ) external returns (address) {
        Article article = new Article(
            id,
            submitter,
            ipfsHash,
            contentHash,
            jcrToken,
            stakeAmount,
            parentIssue
        );
        return address(article);
    }
}