const { ethers } = require("hardhat");
const { upgrades } = require("hardhat");

const proxyAddress = "0xF2D02ae9D62F767537e7D0769254F519B1Eb7616";
async function main() {
  console.log("UUPS Proxy contract address：", proxyAddress);
  // 新的合約
  const contractV2 = await ethers.getContractFactory("contractB");
  console.log(
    "deploy new impl. contract and upgrade proxy logic point to new impl..."
  );

  // 使用 upgradeProxy 進行修改 Proxy 指向新的邏輯合約(會自動部署新的合約，然後調用 proxy 合約的 upgradeTo)
  await upgrades.upgradeProxy(proxyAddress, contractV2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
