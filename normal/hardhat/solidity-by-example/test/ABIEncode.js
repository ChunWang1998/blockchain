const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("ABIEecode", function () {
  let signer, account1, account2;
  let contractName = contractsName.ABIEncode;
  let contractInstance;

  let tokenInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    contractInstance = await hre.ethers.deployContract(contractName);
    await contractInstance.waitForDeployment();

    tokenInstance = await hre.ethers.deployContract("Token");
    await tokenInstance.waitForDeployment();

    console.log(`deployed to ${contractInstance.target}`);
  });

  it("encode", async function () {
    let a = await contractInstance.encodeWithSignature(contractInstance.target, 1);
    let b = await contractInstance.encodeWithSelector(contractInstance.target, 1);
    let c = await contractInstance.encodeCall(contractInstance.target, 1);
    expect(a).to.equal(b).to.equal(c);

    await contractInstance.test(tokenInstance.target, a);
  });
});
