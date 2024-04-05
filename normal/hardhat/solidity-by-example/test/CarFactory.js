const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("CarFactory", function () {
  let signer, account1, account2;
  let contractName = contractsName.CarFactory;
  let contractInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    contractInstance = await hre.ethers.deployContract(contractName);
    await contractInstance.waitForDeployment();

    console.log(`deployed to ${contractInstance.target}`);
  });

  it("should create cars and send ethers successfully", async function () {
    await contractInstance.create(signer, "model1");
    expect(await contractInstance.getCar(0)).includes("model1");
    await contractInstance.create2AndSendEther(signer, "model2", hre.ethers.encodeBytes32String("HelloWorld"), {
      value: hre.ethers.parseEther("1.0"),
    });
    expect(await contractInstance.getCar(1)).includes("model2");
  });
});
