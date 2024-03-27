const hre = require("hardhat");
const { contractsName } = require("../constant");

let signer, account1, account2;
let contractName = contractsName.MultiSigWallet;
let contractInstance;

async function init() {
  // accounts = await ethers.getSigners();
  [signer, account1, account2] = await hre.ethers.getSigners();
  // account1 = accounts[1].address;
  // account2 = accounts[2].address;
  contractInstance = await hre.ethers.deployContract(contractName, [
    [signer.address, account1.address, account2.address],
    2,
  ]);

  await contractInstance.waitForDeployment();

  console.log(`deployed to ${contractInstance.target}`);
}

(async () => {
  await init();
})();
