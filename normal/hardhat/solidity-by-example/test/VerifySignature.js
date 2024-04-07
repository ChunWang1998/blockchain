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
      1,
    );

    expect(messageHash).to.equal("0xcf36ac4f97dc10d91fc2cbb20d718e94a8cbfe0f82eaedc6a4aa38946fb797cd");

    // signed off chain
    const signature = await signer.signMessage(hre.ethers.getBytes(messageHash));
    const anotherSignature = await account1.signMessage(hre.ethers.getBytes(messageHash));
    expect(signature).to.not.equal(anotherSignature);

    const verified = await contractInstance.verify(
      signer.address,
      "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
      123,
      "coffee and donuts",
      1,
      signature,
    );

    expect(verified).to.equal(true);
  });
});
