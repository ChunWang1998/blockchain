require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

const envFilePath = "../.env";

dotenv.config({ path: envFilePath });
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "bsc_testnet",
  networks: {
    bsc_testnet: {
      url: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`,
      accounts: [process.env.METAMASK_ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};
