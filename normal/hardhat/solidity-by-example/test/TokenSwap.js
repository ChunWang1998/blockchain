const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("TokenSwap", function () {
  let signer, account1, account2;
  let tokenAInstance, tokenBInstance;
  let tokenSwapInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();

    // mint A token to signer
    tokenAInstance = await hre.ethers.deployContract(contractsName.MyToken, ["Atoken", "A", 18]);
    await tokenAInstance.waitForDeployment();
    console.log(`deployed A token to ${tokenAInstance.target}`);

    // mint B token to account1
    tokenBInstance = await hre.ethers.deployContract(contractsName.MyToken, ["Btoken", "B", 18], account1);
    await tokenBInstance.waitForDeployment();
    console.log(`deployed B token to ${tokenBInstance.target}`);

    tokenSwapInstance = await hre.ethers.deployContract(contractsName.TokenSwap, [
      tokenAInstance.target,
      signer.address,
      100,
      tokenBInstance.target,
      account1.address,
      200,
    ]);
    await tokenSwapInstance.waitForDeployment();
    console.log(`deployed contract to ${tokenSwapInstance.target}`);
  });

  it("should swap token after approving", async function () {
    console.log(`- Signer's A token balance: ${await tokenAInstance.balanceOf(signer.address)}`);
    console.log(`- Account 1's B token balance: ${await tokenBInstance.balanceOf(account1.address)}`);

    await tokenAInstance.approve(tokenSwapInstance.target, 100);
    await tokenBInstance.connect(account1).approve(tokenSwapInstance.target, 200);

    await tokenSwapInstance.connect(signer).swap();

    console.log(`- Signer's A token balance: ${await tokenAInstance.balanceOf(signer.address)}`);
    console.log(`- Signer's B token balance: ${await tokenBInstance.balanceOf(signer.address)}`);
    console.log(`- Account 1's A token balance: ${await tokenAInstance.balanceOf(account1.address)}`);
    console.log(`- Account 1's B token balance: ${await tokenBInstance.balanceOf(account1.address)}`);
  });
});
