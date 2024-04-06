const { expect } = require("chai");
const hre = require("hardhat");
const { contractsName } = require("../constant");

describe("MultiSigWallet", function () {
  let signer, account1, account2;
  let contractName = contractsName.MultiSigWallet;
  let contractInstance;

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    contractInstance = await hre.ethers.deployContract(contractName, [
      [signer.address, account1.address, account2.address],
      2,
    ]);
    await contractInstance.waitForDeployment();

    console.log(`deployed to ${contractInstance.target}`);
  });

  it("should execute tx successfully", async function () {
    await signer.sendTransaction({
      to: contractInstance.target,
      value: hre.ethers.parseEther("1.0"),
    });

    const data = hre.ethers.encodeBytes32String("0x0");

    await contractInstance.submitTransaction(account2, hre.ethers.parseEther("1.0"), data);
    const [to] = await contractInstance.getTransaction(0);
    expect(to).to.equal(account2);

    await expect(contractInstance.confirmTransaction(0))
      .to.emit(contractInstance, "ConfirmTransaction")
      .withArgs(signer.address, 0); // Check ConfirmTransaction event
    const transaction = await contractInstance.getTransaction(0);

    expect(transaction[4]).to.equal(1); // Check confirmation count
    const isConfirmed = await contractInstance.isConfirmed(0, signer.address);
    expect(isConfirmed).to.equal(true); // Check confirmation by signer

    //await contractInstance.executeTransaction(0);
    //fail

    await contractInstance.connect(account2).confirmTransaction(0);
    await contractInstance.executeTransaction(0);

    //check event
  });
});
