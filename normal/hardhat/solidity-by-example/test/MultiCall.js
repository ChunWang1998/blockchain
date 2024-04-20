const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("MultiCall", function () {
  let signer, account1, account2;
  let contractName = contractsName.MultiCall;
  let contractInstance, testInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    contractInstance = await hre.ethers.deployContract(contractName);
    await contractInstance.waitForDeployment();

    console.log(`deployed to ${contractInstance.target}`);

    testInstance = await hre.ethers.deployContract("TestMultiCall");
    await testInstance.waitForDeployment();
  });

  it("get correct data", async function () {
    let data1 = await testInstance.getData1();
    let data2 = await testInstance.getData2();
    let res = await contractInstance.multiCall([testInstance.target, testInstance.target], [data1, data2]);
    expect(res[0]).to.equal(res[1]);
  });
});
