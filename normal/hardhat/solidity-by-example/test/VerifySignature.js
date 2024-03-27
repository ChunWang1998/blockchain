const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("VerifySignature", function () {
  let signer, account1, account2;
  let contractName = contractsName.VerifySignature;
  let contractInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    contractInstance = await hre.ethers.deployContract(contractName);
    await contractInstance.waitForDeployment();

    console.log(`deployed to ${contractInstance.target}`);
  });

  it("should sign and verify successfully", async function () {
    const messageHash = await contractInstance.getMessageHash(
      "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c",
      123,
      "coffee and donuts",
      1
    );

    // signed off chain
    const signature = await signer.signMessage(
      hre.ethers.getBytes(messageHash)
    );

    const verified = await contractInstance.verify(
      signer.address,
      "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
      123,
      "coffee and donuts",
      1,
      signature
    );

    // console.log("Signature verified:", verified);
  });
});
