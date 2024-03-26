const hre = require("hardhat");
const { ethers } = hre;
const { contractsName } = require("../constant");

let accounts, account1;
let contractName = contractsName.FunctionSelector;

async function init() {
  accounts = await ethers.getSigners();
  account1 = accounts[1].address;
  const contractInstance = await hre.ethers.deployContract(contractName);

  await contractInstance.waitForDeployment();

  console.log(`deployed to ${contractInstance.target}`);
  return contractInstance;
}

async function functionSelector(contractInstance) {
  let selector = await contractInstance.getSelector(
    "transfer(address,uint256)"
  );
  console.log(selector); //0xa9059cbb
  //can be used with abi.encodeWithSelector()
}

(async () => {
  let contractInstance = await init();
  await functionSelector(contractInstance);
})();
