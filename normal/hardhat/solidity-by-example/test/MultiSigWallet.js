const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("MultiSigWallet", function () {
  let signer, account1, account2;
  let contractName = contractsName.MultiSigWallet;
  let contractInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    contractInstance = await hre.ethers.deployContract(contractName, [
      [signer.address, account1.address, account2.address],
      2,
    ]);
    await contractInstance.waitForDeployment();

    console.log(`deployed to ${contractInstance.target}`);
  });

  it("should execute tx successfully", async function () {
    const tx = await signer.sendTransaction({
      to: contractInstance.target,
      value: hre.ethers.parseEther("1.0"),
    });

    const data = hre.ethers.encodeBytes32String("0x0");

    await contractInstance.submitTransaction(account2, hre.ethers.parseEther("1.0"), data);

    await contractInstance.confirmTransaction(0);

    //await contractInstance.executeTransaction(0);
    //fail

    await contractInstance.connect(account2).confirmTransaction(0);
    await contractInstance.executeTransaction(0);

    //check event
  });
});
