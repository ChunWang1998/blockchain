const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

/*
If you can get creationCode from the contract, you can deploy the contract
*/

describe("DeployAnyContract", function () {
  let signer, account1, account2;
  let proxy = contractsName.DeployAnyContract;
  let proxyInstance;

  let helper = contractsName.Helper;
  let helperInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    proxyInstance = await hre.ethers.deployContract(proxy);
    await proxyInstance.waitForDeployment();

    helperInstance = await hre.ethers.deployContract(helper);
    await helperInstance.waitForDeployment();

    console.log(`deployed to ${proxyInstance.target}`);
  });

  it("testContract1", async function () {
    let byteCode1 = await helperInstance.getBytecode1();
    await proxyInstance.deploy(byteCode1); // deploy the TestContract1 by TestContract1's creationCode
    let event = (await proxyInstance.queryFilter("Deploy"))[0];
    let testContract1Addr = event.args[0];

    const testContract1Factory = await hre.ethers.getContractFactory("TestContract1");
    const testContract1 = testContract1Factory.attach(testContract1Addr);
    expect(await testContract1.owner()).to.equal(proxyInstance.target);

    let newOwner = signer.address;
    let setOwnerCallData = await helperInstance.getCalldata(newOwner);

    await proxyInstance.execute(testContract1.target, setOwnerCallData);
    expect(await testContract1.owner()).to.equal(newOwner);
  });
  it("testContract2", async function () {
    let byteCode2 = await helperInstance.getBytecode2(1, 2);
    await proxyInstance.deploy(byteCode2, {
      value: hre.ethers.parseEther("1"),
    });
    let event = (await proxyInstance.queryFilter("Deploy"))[0];
    let testContract2Addr = event.args[0];

    const testContract2Factory = await hre.ethers.getContractFactory("TestContract2");
    const testContract2 = testContract2Factory.attach(testContract2Addr);
    expect(await testContract2.owner()).to.equal(proxyInstance.target);
    expect(await testContract2.value()).to.equal(hre.ethers.parseEther("1"));
  });
});
