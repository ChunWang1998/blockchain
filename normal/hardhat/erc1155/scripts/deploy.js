const { contractAddress, contractName } = require("../constant");
const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log(
    "Account balance:",
    await deployer.provider.getBalance(deployer.address)
  );

  const Token = await ethers.getContractFactory(contractName); //Replace with name of your smart contract
  const token = await Token.deploy(deployer.address);

  console.log("contract address:", await token.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
