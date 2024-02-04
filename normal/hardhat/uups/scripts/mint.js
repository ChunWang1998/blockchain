const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x2D8C785bEBdd1a0B642d06B6ef69668bbb1FA0F8";
  const contractFactory = await ethers.getContractFactory("contractA");
  const contract = contractFactory.attach(contractAddress);
  const Alice = "0xBE4494DaB28095e1465aB151a21e9D529752998A";

  id = 6;
  amount = 3;
  flag = true;
  if (flag) {
    try {
      await contract.mint(Alice, id, amount, "0x00");
    } catch (error) {
      console.log("error" + error);
    } finally {
      console.log((await contract.balanceOf(Alice, id)).toString());
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
