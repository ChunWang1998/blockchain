import { ethers } from "hardhat";

async function deployContract(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const ContractFactory = await ethers.getContractFactory("Comet");
  const contract = await ContractFactory.deploy(/* constructor arguments, if any */);
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
