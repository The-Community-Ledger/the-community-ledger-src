const { ethers } = require("hardhat");

async function main() {
  const wallContract = await ethers.deployContract("Wall");
  await wallContract.waitForDeployment();

  const initialSupply = ethers.parseEther("1000000000"); // 1,000,000,000 tokens
  const JournalCredit = await ethers.getContractFactory("JournalCredit");
  const journalCredit = await JournalCredit.deploy(initialSupply);
  await journalCredit.waitForDeployment();
  console.log("JournalCredit deployed to:", journalCredit.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
