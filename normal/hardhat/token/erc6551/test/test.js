const { expect } = require("chai");
const hre = require("hardhat");

describe("erc6551", function () {
  let signer, account1, account2;
  let pinnieInstance, accountInstance, registryInstance;
  const baseURI = "ipfs://QmTRxBoLapSUgAiaz2FxvQYW2ektgJnhoomzaQ8Q76puvA";

  beforeEach(async function () {
    [signer, account1, account2] = await hre.ethers.getSigners();
    const pinnie = await hre.ethers.deployContract("Pinnie", [baseURI]);
    pinnieInstance = await pinnie.waitForDeployment();

    console.log(`deployed to ${pinnieInstance.target}`);

    const account = await hre.ethers.deployContract("ERC6551Account");
    accountInstance = await account.waitForDeployment();

    const registry = await hre.ethers.deployContract("ERC6551Registry");
    registryInstance = await registry.waitForDeployment();
  });

  it("test", async function () {
    //mint NFT
    const tokenId = await pinnieInstance.nextId();
    await pinnieInstance.safeMint(signer.address, baseURI);

    //create TBA
    const salt = 0;
    const initData = "0x";
    //create the TBA and binding it to our ERC-721
    await registryInstance.createAccount(
      accountInstance.target,
      31337,
      pinnieInstance.target,
      tokenId,
      salt,
      initData
    );
    //ensure an address is being returned properly
    const address = await registryInstance.account(
      accountInstance.target,
      31337,
      pinnieInstance.target,
      tokenId,
      salt
    );
    console.log("Account created successfully at address: ", address);

    //interact with TBA
    const newName = hre.ethers.encodeBytes32String("Pinnie's Savings Account");
    await accountInstance.setAccountName(newName);
    const accountName = await accountInstance.getAccountName();
    expect(newName).to.equal(accountName);
  });
});
