require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

const envFilePath = "../.env";

dotenv.config({ path: envFilePath });
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/lCvj75OmaOo8Bst8BOwDlv4mGyX1LYea`,
      accounts: [process.env.METAMASK_ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};
