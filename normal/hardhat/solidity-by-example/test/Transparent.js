const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("Transparent proxy", function () {
  let signer, account1, account2;

  let testSlot = contractsName.TestSlot;
  let testSlotInstance;

  let buggyProxy = contractsName.BuggyProxy;
  let buggyProxyInstance;

  let counterV1 = contractsName.CounterV1;
  let counterV1Instance;

  let counterV2 = contractsName.CounterV2;
  let counterV2Instance;

  let proxy = contractsName.Proxy
  let proxyInstance

  let proxyAdmin = contractsName.ProxyAdmin
  let proxyAdminInstance

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();

    testSlotInstance = await hre.ethers.deployContract(testSlot);
    await testSlotInstance.waitForDeployment();

    buggyProxyInstance = await hre.ethers.deployContract(buggyProxy);
    await buggyProxyInstance.waitForDeployment();

    counterV1Instance = await hre.ethers.deployContract(counterV1);
    await counterV1Instance.waitForDeployment();

    counterV2Instance = await hre.ethers.deployContract(counterV2);
    await counterV2Instance.waitForDeployment();

    proxyInstance = await hre.ethers.deployContract(proxy);
    await proxyInstance.waitForDeployment();

    proxyAdminInstance = await hre.ethers.deployContract(proxyAdmin);
    await proxyAdminInstance.waitForDeployment();
  });

  it("buggy proxy with wrong slot between proxy and implementation", async function () {
    await buggyProxyInstance.upgradeTo(counterV1Instance.target);

    // !!!!!!!!!!!!!!!!!!!!!!!!
    // Trough this, you can interact with buggyProxyInstance as if it was an instance
    // of counterV1Instance.
    // refer: https://ethereum.stackexchange.com/questions/128321/fallback-not-executing
    let counterV1WithBuggyProxyAddrInstance = await counterV1Instance.attach(buggyProxyInstance.target);
    // can't get count from counterV1WithBuggyProxyAddrInstance, since can't get variable
    // by fallback function(delegate call)
    expect(await buggyProxyInstance.implementation()).to.equal(counterV1Instance.target);
    await counterV1WithBuggyProxyAddrInstance.inc(); //expect count to be 1
    expect(await buggyProxyInstance.implementation()).not.to.equal(counterV1Instance.target); // add 1 here
  });

  it("storage the variable to any slot you want", async function () {
    // Determine the location where you want to store the address.
    // You can use a specific string and hash to select the location.
    expect(await testSlotInstance.getSlot()).to.equal(hre.ethers.ZeroAddress);
    expect(await testSlotInstance.slot()).to.equal(hre.ethers.keccak256(hre.ethers.toUtf8Bytes("TEST_SLOT")));
    await testSlotInstance.writeSlot(signer.address);
    expect(await testSlotInstance.getSlot()).to.equal(signer.address);
  });

  it("Proxy Admin", async function () {
    await proxyInstance.upgradeTo(counterV1Instance.target);

    await proxyInstance.changeAdmin(proxyAdminInstance.target)

    expect(await proxyAdminInstance.getProxyAdmin(proxyInstance.target)).to.equal(proxyAdminInstance.target)
    expect(await proxyAdminInstance.getProxyImplementation(proxyInstance.target)).to.equal(counterV1Instance.target)

    let counterV1WithProxyAddrInstance = await counterV1Instance.attach(proxyInstance.target);
    await counterV1WithProxyAddrInstance.inc()
    expect(await counterV1WithProxyAddrInstance.count()).to.equal(1)

    await proxyAdminInstance.upgrade(proxyInstance.target, counterV2Instance.target)
    let counterV2WithProxyAddrInstance = await counterV2Instance.attach(proxyInstance.target);
    await counterV2WithProxyAddrInstance.inc()
    expect(await counterV2WithProxyAddrInstance.count()).to.equal(2)
    await counterV2WithProxyAddrInstance.dec()
    expect(await counterV2WithProxyAddrInstance.count()).to.equal(1)
  });
});
