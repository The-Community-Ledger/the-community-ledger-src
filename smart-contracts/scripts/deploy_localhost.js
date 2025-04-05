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
   * Deploy the JournalIssue contract
   * @dev This contract is used to manage individual journal issues.
   */
  const JournalIssue = await ethers.getContractFactory("JournalIssue"); // Get the contract factory for JournalIssue
  const issueName = "Sample Issue"; // Name of the journal issue
  const descriptionIpfsHash = "QmSampleHash"; // IPFS hash for the issue description
  const descriptionContentHash = ethers.keccak256(ethers.toUtf8Bytes('Sample Content')); // Hash of the issue content
  const jcrToken = journalCredit.target; // Address of the JournalCredit token contract
  const durationDays = 30; // Duration of the journal issue in days
  const articleStakeRequired = ethers.parseEther("10"); // Stake required for submitting an article

  // Deploy the JournalIssue contract with the specified parameters
  const journalIssue = await JournalIssue.deploy(
    issueName,
    descriptionIpfsHash,
    descriptionContentHash,
    jcrToken,
    durationDays,
    articleStakeRequired
  );
  await journalIssue.waitForDeployment(); // Wait for the deployment to complete
  console.log("JournalIssue deployed to:", journalIssue.target); // Log the deployed address of JournalIssue
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error); // Log any errors that occur during execution
  process.exitCode = 1; // Set the process exit code to 1 to indicate failure
});
