const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JournalCredit Contract", function () {
  it("Should deploy and mint tokens to the deployer", async function () {
    const [deployer] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000"); // 1,000,000 tokens
    const JournalCredit = await ethers.getContractFactory("JournalCredit");
    const jcr = await JournalCredit.deploy(initialSupply);
    await jcr.waitForDeployment();

    const deployerBalance = await jcr.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(initialSupply);
  });

  it("Should allow minting of new tokens", async function () {
    const [deployer, recipient] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000"); // 1,000,000 tokens
    const JournalCredit = await ethers.getContractFactory("JournalCredit");
    const jcr = await JournalCredit.deploy(initialSupply);
    await jcr.waitForDeployment();

    const mintAmount = ethers.parseEther("100");
    await jcr.mint(recipient.address, mintAmount);

    const recipientBalance = await jcr.balanceOf(recipient.address);
    expect(recipientBalance).to.equal(mintAmount);
  });
});