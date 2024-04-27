const { expect } = require("chai");
const hre = require("hardhat");

describe("LogEvent", function () {
  it("log event", async function () {
    let [signer] = await hre.ethers.getSigners();
    let testLogInstance = await hre.ethers.deployContract("LogEvent");
    await testLogInstance.waitForDeployment();

    await expect(testLogInstance.testLogHere(signer.address, 42))
      .to.emit(testLogInstance, "LogHere")
      .withArgs(signer.address, 42);

    const tx = await testLogInstance.testLogHere(signer.address, 42);
    await tx.wait();

    // Get the logs emitted by the contract
    const logs = await ethers.provider.getLogs({
      // fromBlock: tx.blockNumber,
      // toBlock: tx.blockNumber,
      address: testLogInstance.target,
      //   topics: [ethers.id("LogHere(address,uint256)")], // Event signature
    });
    const log = testLogInstance.interface.parseLog(logs[0]);

    expect(log.name).to.equal("LogHere");
    expect(log.args.sender).to.equal(signer.address);
    expect(log.args.number).to.equal(42);
  });
});

// write another describe to test another contract
