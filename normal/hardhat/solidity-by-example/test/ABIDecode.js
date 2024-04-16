const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("ABIDecode", function () {
  let signer, account1, account2;
  let contractName = contractsName.ABIDecode;
  let contractInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    contractInstance = await hre.ethers.deployContract(contractName);
    await contractInstance.waitForDeployment();

    console.log(`deployed to ${contractInstance.target}`);
  });

  it("should encode and decode", async function () {
    let myStruct = {
      name: "test",
      nums: [99, 10],
    };
    let testInput = {
      x: 1,
      addr: signer.address,
      arr: [1, 2, 3],
      myStruct: myStruct,
    };

    let encodeData = await contractInstance.encode(testInput.x, testInput.addr, testInput.arr, testInput.myStruct);
    let decodeData = await contractInstance.decode(encodeData);
    //  expect(decodeData).to.equal(testInput);
  });
});
