const { ethers } = require("hardhat");
const utils = require("ethers").utils;


async function main() {
  const wallContract = await ethers.deployContract("Wall");
  await wallContract.waitForDeployment();

  /**
   * Deploy the JournalCredit contract
   * @dev This contract is used to manage the Journal credits.
   */
  const initialSupply = ethers.parseEther("1000000000"); // 1,000,000,000 tokens
  const JournalCredit = await ethers.getContractFactory("JournalCredit");
  const journalCredit = await JournalCredit.deploy(initialSupply);
  await journalCredit.waitForDeployment();
  console.log("JournalCredit deployed to:", journalCredit.target);

  const JournalIssue = await ethers.getContractFactory("JournalIssue");
  const issueName = "Sample Issue";
  const descriptionIpfsHash = "QmSampleHash";
  const descriptionContentHash = ethers.keccak256(ethers.toUtf8Bytes('Sample Content'));
  const jcrToken = journalCredit.target;
  const durationDays = 30;
  const articleStakeRequired = ethers.parseEther("10");

  const journalIssue = await JournalIssue.deploy(
    issueName,
    descriptionIpfsHash,
    descriptionContentHash,
    jcrToken,
    durationDays,
    articleStakeRequired
  );
  await journalIssue.waitForDeployment();
  console.log("JournalIssue deployed to:", journalIssue.target); 

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
