const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("minimum proxy", function () {
  let signer, account1, account2;

  let proxyFactory = contractsName.MinimalProxy;
  let proxyFactoryInstance, implementationInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();

    proxyFactoryInstance = await hre.ethers.deployContract(proxyFactory);
    await proxyFactoryInstance.waitForDeployment();

    implementationInstance = await hre.ethers.deployContract("ImplementationContract");
    await implementationInstance.waitForDeployment();
  });

  it("minimum proxy", async function () {
    const proxyContract = await proxyFactoryInstance.clone(implementationInstance.target);
    // await proxyContract.wait()
    // console.log(proxyContract)
    console.log("proxy factory: " + proxyFactoryInstance.target);
    console.log("implementation: " + implementationInstance.target);
    //  const proxy = await hre.ethers.getContractAt(
    // "ImplementationContract",
    // proxyContract
    //  );
    // console.log(proxy.target)
  });
});
