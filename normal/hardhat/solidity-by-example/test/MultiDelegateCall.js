const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("MultiCall", function () {
  let signer, account1, account2;
  let contractName = contractsName.MultiDelegatecall;
  let contractInstance, testInstance, helperInstance, multicallInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    // contractInstance = await hre.ethers.deployContract(contractName);
    // await contractInstance.waitForDeployment();

    // console.log(`deployed to ${contractInstance.target}`);

    testInstance = await hre.ethers.deployContract("TestMultiDelegatecall");
    await testInstance.waitForDeployment();

    helperInstance = await hre.ethers.deployContract("MultiDelegateCallHelper");
    await helperInstance.waitForDeployment();

    multicallInstance = await hre.ethers.deployContract("MultiCallCompareToMultiDelegateCall");
    await multicallInstance.waitForDeployment();
  });

  it("get correct data", async function () {
    let data1 = await helperInstance.getFunc1Data(3, 6);
    let data2 = await helperInstance.getFunc2Data();

    // msg.sender is signer!
    await expect(testInstance.multiDelegatecall([data1]))
      .to.emit(testInstance, "Log")
      .withArgs(signer.address, "func1", 9);

    await expect(testInstance.multiDelegatecall([data2]))
      .to.emit(testInstance, "Log")
      .withArgs(signer.address, "func2", 2);

    //console.log event / emit
    // let tx = await testInstance.multiDelegatecall([data1]);
    // tx.wait();
    // const logs = await ethers.provider.getLogs({
    //   // fromBlock: tx.blockNumber,
    //   // toBlock: tx.blockNumber,
    //   address: testInstance.target,
    //   //   topics: [ethers.id("LogHere(address,uint256)")], // Event signature
    // });
    // const log = testInstance.interface.parseLog(logs[0]);
    // console.log(log.args.i);

    // compare to .call()
    await expect(multicallInstance.multiCall([testInstance.target], [data1]))
      .to.emit(testInstance, "Log")
      .withArgs(multicallInstance.target, "func1", 9);
  });
});
