const { ethers } = require("hardhat");
const { upgrades } = require("hardhat");

async function main() {
  const NFT = await ethers.getContractFactory("contractA");

  console.log("正在發佈 contractA ...");
  const [onwer] = await ethers.getSigners();
  const proxy = await upgrades.deployProxy(
    NFT,
    // ["0xBE4494DaB28095e1465aB151a21e9D529752998A"],
    [onwer.address],
    {
      initializer: "initialize", // call this function as initializer
      kind: "uups",
    }
  );
  const deploy = await proxy.waitForDeployment();

  //this can be verify as proxy contract on explorer
  console.log("Proxy 合約地址", deploy.target);

  console.log(
    "邏輯合約地址",
    await upgrades.erc1967.getImplementationAddress(deploy.target)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
