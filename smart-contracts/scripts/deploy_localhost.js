const { ethers } = require("hardhat");

async function main() {
  // Deploy the Wall contract
  const wallContract = await ethers.deployContract("Wall");
  await wallContract.waitForDeployment();

  /**
   * Deploy the JournalCredit contract
   * @dev This contract is used to manage the Journal credits.
   */
  const initialSupply = ethers.parseEther("1000000000"); // Set the initial supply to 1,000,000,000 tokens
  const JournalCredit = await ethers.getContractFactory("JournalCredit"); // Get the contract factory for JournalCredit
  const journalCredit = await JournalCredit.deploy(initialSupply); // Deploy the JournalCredit contract with the initial supply
  await journalCredit.waitForDeployment(); // Wait for the deployment to complete
  console.log("JournalCredit deployed to:", journalCredit.target); // Log the deployed address of JournalCredit

  /**
   * Deploy the JournalCore contract
   * @dev This contract is used to manage the core functionalities of the journal.
   */
  const issueStakeRequired = ethers.parseEther("1000"); // Set the issue stake required to 10 tokens
  const JournalCore = await ethers.getContractFactory("JournalCore"); // Get the contract factory for JournalCore
  const journalCore = await JournalCore.deploy(journalCredit.target, issueStakeRequired); // Deploy the JournalCore contract with the wall contract address
  await journalCore.waitForDeployment(); // Wait for the deployment to complete
  console.log("JournalCore deployed to:", journalCore.target); // Log the deployed address of JournalCore

  /**
   * Deploy the JournalIssue contract
   * @dev This contract is used to manage individual journal issues.
   */
  const issueName = "Advances"; // Name of the journal issue
  const descriptionIpfsHash = "QmSampleHash"; // IPFS hash for the issue description
  const descriptionContentHash = ethers.keccak256(ethers.toUtf8Bytes('Sample Content')); // Hash of the issue content
  const durationDays = 10000000; // Duration of the journal issue in days
  const articleStakeRequired = ethers.parseEther("10"); // Stake required for submitting an article

  // Deploy the JournalIssue contract with the specified parameters
  const JournalIssue = await ethers.getContractFactory("JournalIssue"); // Get the contract factory for JournalIssue
  const journalIssue = await JournalIssue.deploy(
    0,
    issueName,
    descriptionIpfsHash,
    descriptionContentHash,
    journalCredit.target,
    durationDays,
    articleStakeRequired
  );
  await journalIssue.waitForDeployment(); // Wait for the deployment to complete
  console.log("JournalIssue deployed to:", sampleIssue); // Log the deployed address of JournalIssue
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error); // Log any errors that occur during execution
  process.exitCode = 1; // Set the process exit code to 1 to indicate failure
});
