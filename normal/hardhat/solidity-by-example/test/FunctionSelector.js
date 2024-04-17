const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("FunctionSelector", function () {
  let signer, account1, account2;
  let contractName = contractsName.FunctionSelector;
  let contractInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    contractInstance = await hre.ethers.deployContract(contractName);
    await contractInstance.waitForDeployment();

    console.log(`deployed to ${contractInstance.target}`);
  });

  it("should get selector successfully", async function () {
    let selector = await contractInstance.getSelector("transfer(address,uint256)");
    expect(selector).to.equal("0xa9059cbb");
    let msgData =
      "0xa9059cbb000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000032";
    await expect(contractInstance.transfer(signer.address, 50)).to.emit(contractInstance, "Log").withArgs(msgData);
  });
});
