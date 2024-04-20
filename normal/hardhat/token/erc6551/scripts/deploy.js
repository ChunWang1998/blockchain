const hre = require("hardhat");

async function main() {
  const Pinnie = await hre.ethers.deployContract("Pinnie", [
    "ipfs://QmTRxBoLapSUgAiaz2FxvQYW2ektgJnhoomzaQ8Q76puvA",
  ]);
  const pinnie = await Pinnie.waitForDeployment();

  const Account = await hre.ethers.deployContract("ERC6551Account");
  const account = await Account.waitForDeployment();

  const Registry = await hre.ethers.deployContract("ERC6551Registry");
  const registry = await Registry.waitForDeployment();

  console.log("Pinnie contract deployed at:", pinnie.target);
  console.log("Account contract deployed at:", account.target);
  console.log("Registry contract deployed at:", registry.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
