const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
describe("EnglishAuction", function () {
  let signer, account1, account2;
  let contractName = contractsName.EnglishAuction;
  let contractInstance;

  let ERC721Instance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    ERC721Instance = await hre.ethers.deployContract(contractsName.MyNFT);
    await ERC721Instance.waitForDeployment();
    await ERC721Instance.mint(signer.address, 77);

    contractInstance = await hre.ethers.deployContract(contractName, [ERC721Instance.target, 77, 1]);
    await contractInstance.waitForDeployment();

    console.log(`deployed to ${contractInstance.target}`);
  });

  it("auction", async function () {
    await ERC721Instance.approve(contractInstance.target, 77);
    await contractInstance.start();
    await contractInstance.connect(account1).bid({ value: hre.ethers.parseEther("1") });
    await contractInstance.connect(account2).bid({ value: hre.ethers.parseEther("2") });
    await contractInstance.connect(account1).bid({ value: hre.ethers.parseEther("3") });
    expect(await contractInstance.highestBidder()).to.equal(account1.address);
    expect(await contractInstance.highestBid()).to.equal(hre.ethers.parseEther("3"));
    expect(await contractInstance.bids(account1.address)).to.equal(hre.ethers.parseEther("1"));
    expect(await contractInstance.bids(account2.address)).to.equal(hre.ethers.parseEther("2"));

    await hre.network.provider.send("evm_increaseTime", [8 * 3600 * 24]);
    await contractInstance.end();
    expect(await ERC721Instance.ownerOf(77)).to.equal(account1.address);
  });
});
