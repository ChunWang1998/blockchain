require("@openzeppelin/hardhat-upgrades");
const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/lCvj75OmaOo8Bst8BOwDlv4mGyX1LYea`,
      accounts: [
        "bc174d4a0716ac3c7fd9d46d60a23380c22cd32b7e59eaa976e7322a7257765d",
      ],
    },
  },
  etherscan: {
    apiKey: "X6WQUSM2BK97F9UZNNKVX7BSRZHWAKAS55",
  },
};
