const { ethers } = require("hardhat");

async function main() {
  // Deploy the Wall contract
  const wallContract = await ethers.deployContract("Wall");
  await wallContract.waitForDeployment();

  /**
   * Deploy the JournalCredit contract
   * @dev This contract is used to manage the Journal credits.
   */
  const initialSupply = ethers.parseEther("10000"); // Set the initial supply to 1,000,000,000 tokens
  const JournalCredit = await ethers.getContractFactory("JournalCredit"); // Get the contract factory for JournalCredit
  const journalCredit = await JournalCredit.deploy(initialSupply); // Deploy the JournalCredit contract with the initial supply
  await journalCredit.waitForDeployment(); // Wait for the deployment to complete
  console.log("JournalCredit deployed to:", journalCredit.target); // Log the deployed address of JournalCredit

  /** 
   * Deploy the ArticleFactory contract
   * @dev This contract is used to create new articles.
   */
  const ArticleFactory = await ethers.getContractFactory("ArticleFactory"); // Get the contract factory for ArticleFactory
  const articleFactory = await ArticleFactory.deploy(journalCredit.target); // Deploy the ArticleFactory contract with the journal credit address
  await articleFactory.waitForDeployment(); // Wait for the deployment to complete
  console.log("ArticleFactory deployed to:", articleFactory.target); // Log the deployed address of ArticleFactory

  /** 
   * Deploy the JournalIssueFactory contract
   * @dev This contract is used to create new journal issues.
   */
  const JournalIssueFactory = await ethers.getContractFactory("JournalIssueFactory"); // Get the contract factory for JournalIssueFactory
  const journalIssueFactory = await JournalIssueFactory.deploy(journalCredit.target, articleFactory.target); // Deploy the JournalIssueFactory contract with the journal credit address
  await journalIssueFactory.waitForDeployment(); // Wait for the deployment to complete
  console.log("JournalIssueFactory deployed to:", journalIssueFactory.target); // Log the deployed address of JournalIssueFactory

  /**
   * Deploy the JournalCore contract
   * @dev This contract is used to manage the core functionalities of the journal.
   */
  const issueStakeRequired = ethers.parseEther("1000"); // Set the issue stake required to 10 tokens
  const JournalCore = await ethers.getContractFactory("JournalCore"); // Get the contract factory for JournalCore
  const journalCore = await JournalCore.deploy(journalCredit.target, issueStakeRequired, journalIssueFactory.target); // Deploy the JournalCore contract with the wall contract address
  await journalCore.waitForDeployment(); // Wait for the deployment to complete
  console.log("JournalCore deployed to:", journalCore.target); // Log the deployed address of JournalCore

  await journalCredit.setMinter(journalCore.target);

  // Deploy an example of the JournalIssue/Article/Review contracts

  const issueNames = ["Advances", "Research", "Innovation"]; // Names of the journal issues
  for (const issueName of issueNames) {
    await createIssue(issueName, journalCredit, journalCore); // Create a new journal issue
  }

}

async function createIssue(issueName, journalCredit, journalCore) {
  /**
   * Deploy a sample JournalIssue contract
   */
  const descriptionIpfsHash = "QmSampleHash"; // IPFS hash for the issue description
  const descriptionContentHash = ethers.keccak256(ethers.toUtf8Bytes('Sample Content')); // Hash of the issue content
  const durationDays = 10000000; // Duration of the journal issue in days
  const articleStakeRequired = ethers.parseEther("100"); // Stake required for submitting an article
  const reviewStakeRequired = ethers.parseEther("10"); // Stake required for submitting an article

  journalCredit.approve(journalCore.target, ethers.parseEther("10000")); // Approve the JournalCore contract to spend the journal credit
  const tx = await journalCore.createIssue(issueName, descriptionIpfsHash, descriptionContentHash, durationDays, articleStakeRequired, reviewStakeRequired); // Create a new journal issue
  console.log("JournalIssue created with name:", issueName); // Log the name of the created journal issue

  // Wait for the transaction to be mined
  const receipt = await tx.wait();

  // Now extract the event log
  const event = receipt.logs
    .map(log => {
      try {
        return journalCore.interface.parseLog(log);
      } catch (e) {
        return null;
      }
    })
    .find(parsed => parsed && parsed.name === "IssueOpened");
  if (!event) {
    throw new Error("IssueOpened event not found in transaction logs");
  }
  const issueAddress = ethers.getAddress(event.args.issueAddress);
  console.log("New JournalIssue contract deployed at:", issueAddress);
  
  const JournalIssue = await ethers.getContractFactory("JournalIssue"); // Get the contract factory for JournalIssue
  const journalIssue = await JournalIssue.attach(issueAddress); // Attach to the deployed JournalIssue contract

  /** 
   * Deploy several sample Article contracts
   */
  journalCredit.approve(journalIssue.target, ethers.parseEther("10000")); // Approve the JournalCore contract to spend the journal credit
  for (let i = 0; i < 6; i++) {
    // const articleId = i; // ID of the article
    const articleIpfsHash = "QmSampleArticleHash" + i; // IPFS hash for the article
    const articleContentHash = ethers.keccak256(ethers.toUtf8Bytes('Sample Article Number ' + i)); // Hash of the article content
    // const articleStake = ethers.parseEther("10"); // Stake required for submitting the article
    // const articleAuthor = ethers.getAddress("0x1234567890123456789012345678901234567890"); // Author of the article
    await journalIssue.submitArticle(articleIpfsHash, articleContentHash); // Create a new article

    console.log("Article created: Sample Article Number ", i); // Log the ID of the created article
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error); // Log any errors that occur during execution
  process.exitCode = 1; // Set the process exit code to 1 to indicate failure
});
