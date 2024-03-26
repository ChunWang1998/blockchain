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

async function functionSelector() {
  let selector = await contractInstance.getSelector(
    "transfer(address,uint256)"
  );
  console.log(selector); //0xa9059cbb
  //can be used with abi.encodeWithSelector()
}

async function createOtherContract() {
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

/*
signed msg off chain, check signature on chain
*/
async function verifySignature() {
  const messageHash = await contractInstance.getMessageHash(
    "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c",
    123,
    "coffee and donuts",
    1
  );

  // signed off chain
  const signature = await signer.signMessage(hre.ethers.getBytes(messageHash));

  const verified = await contractInstance.verify(
    signer.address,
    "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
    123,
    "coffee and donuts",
    1,
    signature
  );

  console.log("Signature verified:", verified);
}

/*
  contractInstance = await hre.ethers.deployContract(contractName, [
    [signer.address, account1.address, account2.address],
    2,
  ]);
*/
async function multiSigWallet() {
  console.log(contractInstance.target);
  const tx = await signer.sendTransaction({
    to: contractInstance.target,
    value: hre.ethers.parseEther("1.0"),
  });

  const data = hre.ethers.encodeBytes32String("0x0");

  await contractInstance.submitTransaction(
    account2,
    hre.ethers.parseEther("1.0"),
    data
  );

  await contractInstance.confirmTransaction(0);

  //await contractInstance.executeTransaction(0);
  //fail

  await contractInstance.connect(account2).confirmTransaction(0);
  await contractInstance.executeTransaction(0);

  //check event
}

(async () => {
  await init();
  // await functionSelector();
  // await createOtherContract();
  // await verifySignature();
  await multiSigWallet();
})();
