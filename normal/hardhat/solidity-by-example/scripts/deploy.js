const hre = require("hardhat");
const { contractsName } = require("../constant");

let signer, account1, account2;
let contractName = contractsName.CarFactory;

async function init() {
  // accounts = await ethers.getSigners();
  [signer, account1, account2] = await hre.ethers.getSigners();
  // account1 = accounts[1].address;
  // account2 = accounts[2].address;
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

async function createOtherContract(contractInstance) {
  await contractInstance.create(signer, "model1");
  console.log(await contractInstance.getCar(0));
  await contractInstance.create2AndSendEther(
    signer,
    "model2",
    hre.ethers.encodeBytes32String("HelloWorld"),
    {
      value: hre.ethers.parseEther("1.0"),
    }
  );
  console.log(await contractInstance.getCar(1));
}

(async () => {
  let contractInstance = await init();
  // await functionSelector(contractInstance);
  await createOtherContract(contractInstance);
})();
