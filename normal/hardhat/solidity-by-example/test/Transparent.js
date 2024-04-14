const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("Transparent proxy", function () {
  let signer, account1, account2;

  let testSlot = contractsName.TestSlot;
  let testSlotInstance;

  let buggyProxy = contractsName.BuggyProxy;
  let buggyProxyInstance;

  let counterV1WithBuggyProxyAddrInstance;

  let counterV1 = contractsName.CounterV1;
  let counterV1Instance;

  let counterV2 = contractsName.CounterV2;
  let counterV2Instance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();

    testSlotInstance = await hre.ethers.deployContract(testSlot);
    await testSlotInstance.waitForDeployment();

    buggyProxyInstance = await hre.ethers.deployContract(buggyProxy);
    await buggyProxyInstance.waitForDeployment();

    counterV1Instance = await hre.ethers.deployContract(counterV1);
    await counterV1Instance.waitForDeployment();
  });
  it("buggy proxy with wrong slot between proxy and implementation", async function () {
    await buggyProxyInstance.upgradeTo(counterV1Instance.target);

    // !!!!!!!!!!!!!!!!!!!!!!!!
    // Trough this, you can interact with buggyProxyInstance as if it was an instance
    // of counterV1Instance.
    // refer: https://ethereum.stackexchange.com/questions/128321/fallback-not-executing
    counterV1WithBuggyProxyAddrInstance = await counterV1Instance.attach(buggyProxyInstance.target);
    // can't get count from counterV1WithBuggyProxyAddrInstance, since can't get variable by fallback function
    // (delegate call)
    expect(await buggyProxyInstance.implementation()).to.equal(counterV1Instance.target);
    await counterV1WithBuggyProxyAddrInstance.inc(); //expect count to be 1
    expect(await buggyProxyInstance.implementation()).not.to.equal(counterV1Instance.target); // add 1 here
  });

  it("storage slot", async function () {
    // Determine the location where you want to store the address.
    // You can use a specific string and hash to select the location.
    expect(await testSlotInstance.getSlot()).to.equal(hre.ethers.ZeroAddress);
    expect(await testSlotInstance.slot()).to.equal(hre.ethers.keccak256(hre.ethers.toUtf8Bytes("TEST_SLOT")));
    await testSlotInstance.writeSlot(signer.address);
    expect(await testSlotInstance.getSlot()).to.equal(signer.address);
  });
  it("Proxy contract", async function () {
    // await getContractInterface(counterV1);
    // let admin = await counterV1Instance.admin();
    // console.log(admin);
    // expect(await proxyInstance.admin().wait()).to.equal(signer.address);
    // expect(await proxyInstance.implementation()).to.equal(hre.ethers.ZeroAddress);
    //upgrade to with counterV1
    //expect implementation equal to counterV1
  });
});
